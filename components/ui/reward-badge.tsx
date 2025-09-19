import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, PiggyBank, QrCode, Users, Star } from 'lucide-react';
import { Reward } from '@/types';
import { cn } from '@/lib/utils';

interface RewardBadgeProps {
  reward: Reward;
}

const iconMap = {
  trophy: Trophy,
  'piggy-bank': PiggyBank,
  'qr-code': QrCode,
  users: Users,
  star: Star,
};

export const RewardBadge: React.FC<RewardBadgeProps> = ({ reward }) => {
  const Icon = iconMap[reward.icon as keyof typeof iconMap] || Star;

  return (
    <Card className={cn(
      'transition-colors',
      reward.achieved ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-full',
              reward.achieved ? 'bg-yellow-100' : 'bg-gray-200'
            )}>
              <Icon className={cn(
                'h-5 w-5',
                reward.achieved ? 'text-yellow-600' : 'text-gray-400'
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{reward.title}</h3>
              <p className="text-sm text-gray-600">{reward.description}</p>
            </div>
          </div>
          <Badge variant={reward.achieved ? 'default' : 'secondary'}>
            {reward.points} pts
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};