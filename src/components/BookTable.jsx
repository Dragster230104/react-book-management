import { useState, useMemo } from 'react';
import { Trash2, Edit, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookTable = ({ books, onDelete, onEdit }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedBooks = useMemo(() => {
    let sortableBooks = [...books];
    if (sortConfig.key !== null) {
      sortableBooks.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableBooks;
  }, [books, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  if (books.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}
      >
        <h3>No books found.</h3>
        <p>Adjust your filters or add a new book.</p>
      </motion.div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
            {['title', 'author', 'genre', 'publicationYear'].map((key) => (
              <th key={key} onClick={() => requestSort(key)} style={{ padding: '16px 12px', cursor: 'pointer', textTransform: 'capitalize' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {key.replace('publicationYear', 'Year')}
                  <ArrowUpDown size={14} style={{ opacity: sortConfig.key === key ? 1 : 0.3 }} />
                </div>
              </th>
            ))}
            <th style={{ padding: '16px 12px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <AnimatePresence>
          <tbody>
            {sortedBooks.map((book, index) => (
              <motion.tr 
                key={book.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}
                whileHover={{ backgroundColor: '#f8fafc' }}
              >
                <td style={{ padding: '16px 12px', fontWeight: '500', color: '#0f172a' }}>{book.title}</td>
                <td style={{ padding: '16px 12px', color: '#475569' }}>{book.author}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    {book.genre}
                  </span>
                </td>
                <td style={{ padding: '16px 12px', color: '#475569' }}>{book.publicationYear}</td>
                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                  <button onClick={() => onEdit(book)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginRight: '16px' }} title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(book.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </AnimatePresence>
      </table>
    </div>
  );
};

export default BookTable;