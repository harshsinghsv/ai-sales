'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge-2';
import { Button } from '@/components/ui/button-1';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BarChart2, MoreHorizontal } from 'lucide-react';

export interface StatisticCard10Props {
  title?: string;
  amount?: string;
  currency?: string;
  trend?: string;
  trendLabel?: string;
  metric1Label?: string;
  metric1Value?: string;
  metric2Label?: string;
  metric2Value?: string;
  className?: string;
  wrapInCenterContainer?: boolean;
}

export function StatisticCard10({
  title = 'Total Revenue',
  amount = '$ 1,120,500',
  currency = 'USD',
  trend = '-12.7%',
  trendLabel = 'decreased from last quarter',
  metric1Label = 'Avg. Subscription Value:',
  metric1Value = '$320',
  metric2Label = 'Enterprise Clients:',
  metric2Value = '42',
  className,
  wrapInCenterContainer = false,
}: StatisticCard10Props) {
  const card = (
    <Card className={cn('w-full max-w-md bg-white border border-[#E8E6DC] shadow-xs', className)}>
      <CardHeader className="border-0 py-6 min-h-auto">
        <CardTitle className="inline-flex items-center gap-2">
          <BarChart2 className="size-7 text-[#D97757]" />
          <span className="font-semibold text-foreground">{title}</span>
        </CardTitle>
        <CardToolbar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dim" size="sm" mode="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Export Data</DropdownMenuItem>
              <DropdownMenuItem>Pin to Dashboard</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardToolbar>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-3.5">
        <div className="space-y-3.5">
          {/* Revenue */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-3xl font-bold text-foreground tracking-tight">{amount}</span>
            <span className="text-xs text-muted-foreground font-mono font-medium leading-none">{currency}</span>
          </div>

          {/* Revenue trend */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="success" appearance="light">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="inline-block">
                <path
                  d="M3 5.5L7 9.5L11 5.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {trend}
            </Badge>
            <span className="text-xs sm:text-sm text-muted-foreground">{trendLabel}</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg">
            <span className="text-xs sm:text-sm text-accent-foreground">{metric1Label}</span>
            <span className="text-sm sm:text-base font-semibold text-foreground font-mono">{metric1Value}</span>
          </div>
          <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg">
            <span className="text-xs sm:text-sm text-accent-foreground">{metric2Label}</span>
            <span className="text-sm sm:text-base font-semibold text-foreground font-mono">{metric2Value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (wrapInCenterContainer) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 lg:p-8">
        {card}
      </div>
    );
  }

  return card;
}

export default StatisticCard10;
