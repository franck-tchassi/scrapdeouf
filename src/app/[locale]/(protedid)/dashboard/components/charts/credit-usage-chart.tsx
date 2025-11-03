"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths, startOfMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthlyStats {
  date: string; // Format 'YYYY-MM'
  creditsUsed: number;
  extractionsCompleted: number;
}

const chartConfig = {
  creditsUsed: {
    label: "Crédits Utilisés",
    color: "hsl(230 89% 62%)", // Couleur de base Indigo-600
  },
  extractionsCompleted: {
    label: "Extractions Terminées",
    color: "hsl(262 83% 56%)", // Couleur de base Purple-600
  },
} satisfies ChartConfig;

export default function CreditUsageChart() {
  const [data, setData] = React.useState<MonthlyStats[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [timeRange, setTimeRange] = React.useState("6m"); // "6m" for 6 months, "3m" for 3 months

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch user statistics');
        }
        const stats: MonthlyStats[] = await response.json();
        setData(stats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const filteredData = React.useMemo(() => {
    if (!data.length) return [];

    const referenceDate = new Date(); // Current date as reference
    let monthsToSubtract = 5; // Default for 6 months (current month + 5 previous)

    if (timeRange === "3m") {
      monthsToSubtract = 2; // Current month + 2 previous
    } else if (timeRange === "6m") {
      monthsToSubtract = 5; // Current month + 5 previous
    }

    const startDate = startOfMonth(subMonths(referenceDate, monthsToSubtract));

    return data.filter((item) => {
      const itemDate = parseISO(item.date + '-01'); // Convert 'YYYY-MM' to a Date object
      return itemDate >= startDate;
    });
  }, [data, timeRange]);

  const formatMonthTick = (tickItem: string) => {
    const [year, month] = tickItem.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return format(date, 'MMM yyyy', { locale: fr });
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
        <CardHeader>
          <CardTitle>Activité Mensuelle</CardTitle>
          <CardDescription>Utilisation des crédits et extractions terminées par mois.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-gray-500">Chargement des données du graphique...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-red-200/50 shadow-sm">
        <CardHeader>
          <CardTitle>Activité Mensuelle</CardTitle>
          <CardDescription>Utilisation des crédits et extractions terminées par mois.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-red-600">Erreur: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="pt-0 bg-white/80 backdrop-blur-sm border-blue-200/50 shadow-sm">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Activité Mensuelle</CardTitle>
          <CardDescription>
            Utilisation des crédits et extractions terminées par mois.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[180px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Sélectionner une période"
          >
            <SelectValue placeholder="6 derniers mois" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="6m" className="rounded-lg">
              6 derniers mois
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              3 derniers mois
            </SelectItem>
            {/* Pour des options comme '12m' ou 'all', l'API devrait fournir plus de données */}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart data={filteredData}>
            <defs>
              {/* Dégradé pour les crédits utilisés (Indigo vers Purple) */}
              <linearGradient id="creditsUsedGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(230 89% 62%)" /> {/* Indigo-600 */}
                <stop offset="100%" stopColor="hsl(262 83% 56%)" /> {/* Purple-600 */}
              </linearGradient>
              {/* Dégradé pour les extractions terminées (Purple vers Pink pour la distinction) */}
              <linearGradient id="extractionsCompletedGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(262 83% 56%)" /> {/* Purple-600 */}
                <stop offset="100%" stopColor="hsl(340 82% 52%)" /> {/* Pink-500 */}
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} className="stroke-gray-200" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatMonthTick}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke="var(--color-creditsUsed)"
              className="text-xs text-gray-600"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-extractionsCompleted)"
              className="text-xs text-gray-600"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatMonthTick(value)}
                  indicator="dot"
                />
              }
            />
            <Bar
              yAxisId="left"
              dataKey="creditsUsed"
              type="natural"
              fill="url(#creditsUsedGradient)" // Référence au dégradé pour les crédits
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="extractionsCompleted"
              type="natural"
              fill="url(#extractionsCompletedGradient)" // Référence au dégradé pour les extractions
              stackId="a"
              radius={[4, 4, 0, 0]}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}