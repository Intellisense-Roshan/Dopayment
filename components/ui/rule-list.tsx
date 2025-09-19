import React from 'react';
import { Card } from './card';
import { Badge } from './badge';
import { Separator } from './separator';
import { Button } from './button';
import type { SplitRule, RuleScope } from '@/types/bnpl';

interface RuleListProps {
  rules: SplitRule[];
  onEditRule: (rule: SplitRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onCreateRule: () => void;
}

const scopeLabels: Record<RuleScope, string> = {
  global: 'Global',
  merchant: 'Merchant',
  franchise: 'Franchise',
  store: 'Store',
};

export const RuleList: React.FC<RuleListProps> = ({
  rules,
  onEditRule,
  onDeleteRule,
  onCreateRule,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">BNPL Rules</h2>
        <Button onClick={onCreateRule}>Create New Rule</Button>
      </div>

      {rules.map((rule) => (
        <Card key={rule.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium">{rule.name}</h3>
                <Badge variant={rule.isActive ? "default" : "secondary"}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge>{scopeLabels[rule.scope]}</Badge>
              </div>
              
              <p className="text-sm text-gray-500 mt-1">
                {rule.merchantId && `Merchant: ${rule.merchantId} • `}
                Min: ₹{rule.conditions.minAmount.toLocaleString()} • 
                Max: ₹{rule.conditions.maxAmount.toLocaleString()}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onEditRule(rule)}>
                Edit
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDeleteRule(rule.id)}
              >
                Delete
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Split Configuration</p>
                <p className="font-medium">
                  {rule.splitConfig.numberOfParts} parts • 
                  {rule.splitConfig.interestRate}% interest • 
                  ₹{rule.splitConfig.processingFee} fee
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Categories</p>
                <p className="font-medium">
                  {rule.conditions.merchantCategories.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};