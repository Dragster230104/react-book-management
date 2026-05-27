import { useState, useEffect, useMemo } from 'react';
import { fetchBooks, createBook, updateBook, deleteBook } from './services/api';
import { useDebounce } from './hooks/useDebounce';
import { Search, Filter, BookOpen } from 'lucide-react';
import BookTable from './components/BookTable';
import BookForm from './components/BookForm';
import DeleteModal from './components/DeleteModal';
import ReportDashboard from './components/ReportDashboard';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('table');
  
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await fetchBooks();
      setBooks(data);
    } catch (error) {
      alert("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingBook) {
        const updated = await updateBook(editingBook.id, data);
        setBooks(books.map(b => b.id === editingBook.id ? updated : b));
      } else {
        const newBook = await createBook(data);
        setBooks([newBook, ...books]);
      }
      setShowForm(false);
      setEditingBook(null);
    } catch (error) {
      alert("Failed to save the book.");
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleDeleteClick = (id) => {
    const book = books.find(b => b.id === id);
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    const id = bookToDelete.id;
    const previousBooks = [...books];
    setBooks(books.filter(b => b.id !== id));
    setBookToDelete(null); 
    try {
      await deleteBook(id);
    } catch (error) {
      setBooks(previousBooks);
      alert("Failed to delete book.");
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = 
        book.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
        book.author.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesGenre = selectedGenre === '' || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [books, debouncedSearch, selectedGenre]);

  const uniqueGenres = [...new Set(books.map(b => b.genre))].filter(Boolean);

  return (
    // Applied the 'mesh-bg' class here
    <div className="mesh-bg" style={{ minHeight: '100vh', padding: '2rem' }}>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#3b82f6', padding: '10px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
              <BookOpen size={24} />
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Library<span style={{color: '#3b82f6'}}>OS</span></h1>
          </div>
          
          <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '12px' }}>
            <button onClick={() => setView('table')} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: view === 'table' ? '#0f172a' : 'transparent', fontWeight: '600', cursor: 'pointer', color: view === 'table' ? 'white' : '#64748b', transition: 'all 0.2s' }}>
              Client Table
            </button>
            <button onClick={() => setView('dashboard')} style={{ padding: '8px 16px', border: 'none', borderRadius: '8px', background: view === 'dashboard' ? '#0f172a' : 'transparent', fontWeight: '600', cursor: 'pointer', color: view === 'dashboard' ? 'white' : '#64748b', transition: 'all 0.2s' }}>
              Report Dashboard
            </button>
          </div>
        </header>

        {/* Applied 'glass-panel' to the main container */}
        <main className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
          
          {view === 'table' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              
              <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input 
                    type="text" 
                    placeholder="Search by title or author..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', outline: 'none', fontSize: '15px', transition: 'all 0.2s', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}
                    onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
                    onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                
                <div style={{ position: 'relative' }}>
                  <Filter size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', outline: 'none', fontSize: '15px', appearance: 'none', background: 'rgba(255,255,255,0.6)', minWidth: '180px', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(4px)' }}
                    onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
                    onBlur={(e) => { e.target.style.background = 'rgba(255,255,255,0.6)'; e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.boxShadow = 'none'; }}
                  >
                    <option value="">All Genres</option>
                    {uniqueGenres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {!showForm && (
                <button 
                  onClick={() => { setEditingBook(null); setShowForm(true); }}
                  style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  + Add New Book
                </button>
              )}
            </div>
          )}

          {showForm && (
            <BookForm 
              initialData={editingBook} 
              onSubmit={handleFormSubmit} 
              onCancel={() => { setShowForm(false); setEditingBook(null); }} 
            />
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '6rem', color: '#64748b' }}>
               <div style={{ width: '48px', height: '48px', border: '4px solid #f1f5f9', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
               <p style={{ fontWeight: '500' }}>Syncing Library Data...</p>
            </div>
          ) : (
            <div>
              {view === 'table' ? (
                <BookTable books={filteredBooks} onDelete={handleDeleteClick} onEdit={handleEdit} />
              ) : (
                // Now rendering from the separate Dashboard component!
                <ReportDashboard books={books} /> 
              )}
            </div>
          )}
        </main>
        
        <DeleteModal 
          isOpen={!!bookToDelete} 
          onClose={() => setBookToDelete(null)} 
          onConfirm={confirmDelete}
          bookTitle={bookToDelete?.title}
        />

        {/* --- THE CSS MAGIC HAPPENS HERE --- */}
        <style>{`
          * { box-sizing: border-box; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          
          /* The Mesh Gradient Background */
          .mesh-bg {
            background-color: #f8fafc;
            background-image: 
              radial-gradient(at 10% 20%, hsla(228,100%,74%,0.15) 0px, transparent 50%),
              radial-gradient(at 80% 0%, hsla(189,100%,56%,0.15) 0px, transparent 50%),
              radial-gradient(at 0% 50%, hsla(355,100%,93%,0.15) 0px, transparent 50%),
              radial-gradient(at 80% 50%, hsla(340,100%,76%,0.15) 0px, transparent 50%),
              radial-gradient(at 0% 100%, hsla(22,100%,77%,0.15) 0px, transparent 50%),
              radial-gradient(at 80% 100%, hsla(242,100%,70%,0.15) 0px, transparent 50%),
              radial-gradient(at 0% 0%, hsla(343,100%,76%,0.15) 0px, transparent 50%);
            background-attachment: fixed;
          }

          /* Frosted Glass Effect */
          .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;