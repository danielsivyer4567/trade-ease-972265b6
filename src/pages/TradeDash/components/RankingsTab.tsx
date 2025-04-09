
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Medal } from "lucide-react";

export function RankingsTab() {
  const traders = [
    { id: 1, name: 'Sarah Johnson', avatar: '/avatar1.png', return: 32.5, trades: 145, winRate: 68 },
    { id: 2, name: 'Michael Chen', avatar: '/avatar2.png', return: 28.7, trades: 210, winRate: 65 },
    { id: 3, name: 'David Wilson', avatar: '/avatar3.png', return: 26.3, trades: 178, winRate: 62 },
    { id: 4, name: 'Jessica Lee', avatar: '/avatar4.png', return: 24.8, trades: 132, winRate: 60 },
    { id: 5, name: 'Robert Smith', avatar: '/avatar5.png', return: 21.5, trades: 156, winRate: 57 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Traders</CardTitle>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Trader</TableHead>
              <TableHead className="text-right">Return</TableHead>
              <TableHead className="text-right">Trades</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {traders.map((trader, index) => (
              <TableRow key={trader.id}>
                <TableCell>
                  {index === 0 ? (
                    <Medal className="h-5 w-5 text-yellow-500" />
                  ) : index === 1 ? (
                    <Medal className="h-5 w-5 text-gray-400" />
                  ) : index === 2 ? (
                    <Medal className="h-5 w-5 text-amber-700" />
                  ) : (
                    <span className="font-medium">{index + 1}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={trader.avatar} alt={trader.name} />
                      <AvatarFallback>{trader.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{trader.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-green-500">+{trader.return}%</TableCell>
                <TableCell className="text-right">{trader.trades}</TableCell>
                <TableCell className="text-right">{trader.winRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
