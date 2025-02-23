
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calculator, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PayrollEntry {
  employee_id: string;
  regular_hours: number;
  overtime_hours: number;
  hourly_rate: number;
  rdo_hours: number;
}

export default function PayRun() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");
  const [entries, setEntries] = useState<PayrollEntry[]>([
    {
      employee_id: "", // This would be populated from your employees table
      regular_hours: 0,
      overtime_hours: 0,
      hourly_rate: 0,
      rdo_hours: 0,
    },
  ]);

  const calculateSuper = (grossPay: number) => {
    // Current superannuation guarantee rate is 11.0% as of 2023-2024
    return grossPay * 0.11;
  };

  const calculateTaxWithheld = (grossPay: number) => {
    // This is a simplified tax calculation
    // In a real application, you would use ATO tax tables
    // and consider tax-free threshold, HELP debt, etc.
    if (grossPay <= 350) return grossPay * 0.19;
    if (grossPay <= 1500) return grossPay * 0.325;
    return grossPay * 0.37;
  };

  const handleEntryChange = (index: number, field: keyof PayrollEntry, value: number | string) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
    };
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        employee_id: "",
        regular_hours: 0,
        overtime_hours: 0,
        hourly_rate: 0,
        rdo_hours: 0,
      },
    ]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Create the pay run
      const { data: payRun, error: payRunError } = await supabase
        .from("payroll_runs")
        .insert([
          {
            pay_period_start: payPeriodStart,
            pay_period_end: payPeriodEnd,
            status: "draft",
          },
        ])
        .select()
        .single();

      if (payRunError) throw payRunError;

      // Create payroll entries
      const payrollEntries = entries.map((entry) => {
        const grossPay =
          entry.hourly_rate * (entry.regular_hours + entry.overtime_hours * 1.5);
        const superContribution = calculateSuper(grossPay);
        const taxWithheld = calculateTaxWithheld(grossPay);
        const netPay = grossPay - superContribution - taxWithheld;

        return {
          payroll_run_id: payRun.id,
          employee_id: entry.employee_id,
          regular_hours: entry.regular_hours,
          overtime_hours: entry.overtime_hours,
          hourly_rate: entry.hourly_rate,
          gross_pay: grossPay,
          super_contribution: superContribution,
          rdo_hours: entry.rdo_hours,
          rdo_balance: entry.rdo_hours, // This should be accumulated from previous balance
          tax_withheld: taxWithheld,
          net_pay: netPay,
        };
      });

      const { error: entriesError } = await supabase
        .from("payroll_entries")
        .insert(payrollEntries);

      if (entriesError) throw entriesError;

      toast.success("Pay run created successfully");
      navigate("/payroll");
    } catch (error) {
      toast.error("Failed to create pay run");
      console.error("Pay run error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/payroll" className="hover:text-blue-500">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              New Pay Run
            </h1>
          </div>
          <Button variant="outline" onClick={() => window.open("https://online.ato.gov.au/", "_blank")}>
            Access ATO Portal
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Pay Period Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payPeriodStart">Pay Period Start</Label>
                  <Input
                    id="payPeriodStart"
                    type="date"
                    value={payPeriodStart}
                    onChange={(e) => setPayPeriodStart(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payPeriodEnd">Pay Period End</Label>
                  <Input
                    id="payPeriodEnd"
                    type="date"
                    value={payPeriodEnd}
                    onChange={(e) => setPayPeriodEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                {entries.map((entry, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <Label>Employee ID</Label>
                        <Input
                          type="text"
                          value={entry.employee_id}
                          onChange={(e) =>
                            handleEntryChange(index, "employee_id", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Regular Hours</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={entry.regular_hours}
                          onChange={(e) =>
                            handleEntryChange(index, "regular_hours", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>Overtime Hours</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={entry.overtime_hours}
                          onChange={(e) =>
                            handleEntryChange(index, "overtime_hours", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Hourly Rate</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.hourly_rate}
                          onChange={(e) =>
                            handleEntryChange(index, "hourly_rate", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>RDO Hours</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={entry.rdo_hours}
                          onChange={(e) =>
                            handleEntryChange(index, "rdo_hours", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={addEntry}>
                  Add Employee
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/payroll")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating Pay Run..." : "Create Pay Run"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
