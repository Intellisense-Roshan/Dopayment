import type { BNPLPreviewRequest, BNPLPreviewResponse, SplitRule } from '@/types/bnpl';
import { Big } from 'big.js';

// Configure Big.js for financial calculations
Big.DP = 2; // 2 decimal places
Big.RM = Big.roundHalfUp; // Round half up

export class SplitCalculator {
  /**
   * Calculate splits for a BNPL transaction
   * @param request The preview request containing cart and plan details
   * @param rule The split rule to apply
   * @returns Calculated preview response with splits
   */
  static calculateSplits(request: BNPLPreviewRequest, rule: SplitRule): BNPLPreviewResponse {
    // Calculate order amount
    const orderAmount = request.cart.reduce((sum, item) => {
      return sum.plus(Big(item.price).times(item.qty));
    }, Big(0));

    // Calculate BNPL fees
    const processingFee = Big(request.selectedPlan.processingFee || 0);
    const interestAmount = orderAmount
      .times(request.selectedPlan.interestRate)
      .times(request.selectedPlan.tenorMonths)
      .div(1200); // Convert annual rate to monthly and apply
    const bnplFees = processingFee.plus(interestAmount);

    // Calculate net amount to split
    const netToSplit = orderAmount.minus(bnplFees);

    // Apply splits according to rule
    const splits = rule.splits
      .sort((a, b) => a.applyOrder - b.applyOrder)
      .map((split) => {
        let amount: Big;

        // Apply split based on amount type
        if (split.amountType === 'FIXED') {
          amount = Big(split.value);
        } else if (split.amountType === 'PERCENTAGE') {
          amount = netToSplit.times(split.value).div(100);
        } else {
          // Handle conditional splits
          if (split.conditions?.minOrderValue && orderAmount.lt(split.conditions.minOrderValue)) {
            amount = Big(0);
          } else {
            amount = netToSplit.times(split.value).div(100);
          }
        }

        // Apply rounding according to rule
        if (rule.roundingRule === 'bankers') {
          amount = amount.round(2, Big.roundHalfEven);
        } else {
          amount = amount.round(2, Big.roundHalfUp);
        }

        // Calculate scheduled payout date based on settlement policy
        const today = new Date();
        const payoutDate = new Date(today);
        payoutDate.setDate(today.getDate() + rule.settlementPolicy.payoutDelayDays);

        return {
          targetType: split.targetType,
          targetId: split.targetId,
          amount: amount.toNumber(),
          scheduledPayout: payoutDate.toISOString().split('T')[0],
          status: 'pending' as const,
        };
      });

    // Calculate residual and assign according to policy
    const totalSplit = splits.reduce((sum, split) => sum.plus(split.amount), Big(0));
    const residual = netToSplit.minus(totalSplit);

    if (!residual.eq(0)) {
      const residualTarget = splits.find(
        (split) => 
          split.targetType === (rule.residualPolicy === 'merchant' ? 'MERCHANT' : 'PLATFORM')
      );

      if (residualTarget) {
        residualTarget.amount = Big(residualTarget.amount).plus(residual).toNumber();
      } else {
        splits.push({
          targetType: rule.residualPolicy === 'merchant' ? 'MERCHANT' : 'PLATFORM',
          targetId: 'default',
          amount: residual.toNumber(),
          scheduledPayout: new Date().toISOString().split('T')[0],
          status: 'pending',
        });
      }
    }

    return {
      orderAmount: orderAmount.toNumber(),
      bnplFees: bnplFees.toNumber(),
      netToSplit: netToSplit.toNumber(),
      splits,
    };
  }

  /**
   * Calculate splits for a refund
   * @param originalSplits The original transaction splits
   * @param refundAmount The amount to refund
   * @returns Adjusted splits for the refund
   */
  static calculateRefundSplits(originalSplits: BNPLPreviewResponse['splits'], refundAmount: number) {
    const totalOriginal = originalSplits.reduce((sum, split) => sum.plus(split.amount), Big(0));
    const refundBig = Big(refundAmount);

    return originalSplits.map(split => {
      const proportion = Big(split.amount).div(totalOriginal);
      const refundSplit = refundBig.times(proportion).round(2, Big.roundHalfUp);

      return {
        ...split,
        amount: refundSplit.toNumber(),
        status: 'pending' as const
      };
    });
  }
}