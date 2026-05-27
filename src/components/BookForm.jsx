import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';

const BookForm = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialData || {}
  });

  useEffect(() => {
    reset(initialData || {});
  }, [initialData, reset]);

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{ overflow: 'hidden', marginBottom: '24px' }}
    >
      <div style={{ background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>
            {initialData ? 'Edit Book Details' : 'Add a New Book'}
          </h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Title</label>
            <input 
              {...register("title", { required: "Title is required" })} 
              placeholder="e.g., The Martian"
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', transition: 'all 0.2s', background: 'white' }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.title && <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>{errors.title.message}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Author</label>
            <input 
              {...register("author", { required: "Author is required" })} 
              placeholder="e.g., Andy Weir"
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', transition: 'all 0.2s', background: 'white' }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.author && <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>{errors.author.message}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Genre</label>
            <input 
              {...register("genre", { required: "Genre is required" })} 
              placeholder="e.g., Science Fiction"
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', transition: 'all 0.2s', background: 'white' }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.genre && <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>{errors.genre.message}</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Publication Year</label>
            <input 
              type="number"
              {...register("publicationYear", { 
                required: "Year is required",
                min: { value: 1000, message: "Invalid year" },
                max: { value: new Date().getFullYear(), message: "Cannot be in the future" }
              })} 
              placeholder="e.g., 2011"
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px', transition: 'all 0.2s', background: 'white' }}
              onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.publicationYear && <span style={{ color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>{errors.publicationYear.message}</span>}
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <button type="button" onClick={onCancel} style={{ padding: '12px 24px', background: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }} onMouseOver={(e) => e.target.style.background = '#f1f5f9'} onMouseOut={(e) => e.target.style.background = 'white'}>
              Cancel
            </button>
            <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <Save size={18} />
              {initialData ? 'Update Book' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BookForm;