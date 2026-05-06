import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, ShieldAlert, FlaskConical, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const data = [
  { name: 'Cow', count: 120, trend: '+12%' },
  { name: 'Dog', count: 450, trend: '+25%' },
  { name: 'Cat', count: 320, trend: '-5%' },
  { name: 'Horse', count: 95, trend: '+8%' },
  { name: 'Sheep', count: 150, trend: '+15%' },
];

const COLORS = ['#14b8a6', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Analyses Today', value: '1,284', icon: Activity, trend: '+12.5%', color: 'text-sky-400' },
          { label: 'Efficacy High', value: '86%', icon: FlaskConical, trend: '+2.1%', color: 'text-sky-400' },
          { label: 'Active Alerts', value: '12', icon: ShieldAlert, trend: '-4', color: 'text-rose-400' },
          { label: 'Connected Nodes', value: '42', icon: Users, trend: '+3', color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-slate-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold mb-1">Global AI Performance</h2>
              <p className="text-sm text-slate-400">Total analytical volume per species node</p>
            </div>
            <button className="text-xs text-sky-400 hover:underline">View Detailed Report</button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(20, 184, 166, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-lg font-bold mb-6">Recent Alerts</h2>
          <div className="space-y-6">
            {[
              { type: 'warning', msg: 'Resistant pathogen detected in Bovine-X', time: '2m ago' },
              { type: 'info', msg: 'New compound analysis: Parvo-V3 complete', time: '15m ago' },
              { type: 'error', msg: 'Critical toxicity threshold reached: Feline-S', time: '1h ago' },
              { type: 'success', msg: 'Model fine-tuning complete for Equine node', time: '3h ago' },
            ].map((alert, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className={cn(
                  "w-1 h-10 rounded-full shrink-0",
                  alert.type === 'error' ? 'bg-rose-500' : 
                  alert.type === 'warning' ? 'bg-amber-500' :
                  alert.type === 'success' ? 'bg-emerald-500' : 'bg-sky-500'
                )} />
                <div>
                  <p className="text-sm font-medium text-slate-200 group-hover:text-sky-400 transition-colors">{alert.msg}</p>
                  <p className="text-xs text-slate-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-slate-800 text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors">
            Clear Notification Cache
          </button>
        </div>
      </div>
    </div>
  );
}
