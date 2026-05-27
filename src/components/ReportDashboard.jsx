import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend
} from 'recharts';

const ReportDashboard = ({ books }) => {
  
  const genreData = useMemo(() => {
    const counts = books.reduce((acc, book) => {
      const genre = book.genre || 'Unknown';
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [books]);

  const yearData = useMemo(() => {
    const counts = books.reduce((acc, book) => {
      const year = book.publicationYear || 'Unknown';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(counts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);
  }, [books]);

  // THE MAGIC: Algorithmic color generation using the Golden Angle
  const generateColor = (index) => {
    const hue = (index * 137.508) % 360; 
    return `hsl(${hue}, 75%, 55%)`; // Fixed saturation and lightness so they all look cohesive
  };

  if (books.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem', color: '#64748b', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0' }}>
        <h3>Not enough data to generate reports.</h3>
        <p>Add some books to your library to view analytics.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}
    >
      
      {/* Genre Distribution Pie Chart */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>Library by Genre</h3>
        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genreData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {/* Dynamically applying the generated color */}
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={generateColor(index)} />
                ))}
              </Pie>
              <PieTooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: '600' }} 
                itemStyle={{ color: '#0f172a' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Publication Year Bar Chart */}
      <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '24px', color: '#0f172a', fontSize: '18px', fontWeight: '700' }}>Publications by Year</h3>
        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: '500' }} dy={10} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: '500' }} />
              <BarTooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: '600' }} 
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </motion.div>
  );
};

export default ReportDashboard;