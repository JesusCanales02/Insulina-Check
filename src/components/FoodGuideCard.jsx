import { useState, useEffect } from 'react';
import './FoodGuideCard.css';

const FOOD_DATABASE = [
  { id: 1, nombre: 'Tortilla de maíz', unidad: '1 pieza', carbos: 12 },
  { id: 2, nombre: 'Pan de caja / Molde', unidad: '1 rebanada', carbos: 15 },
  { id: 3, nombre: 'Arroz cocido', unidad: '1 taza', carbos: 45 },
  { id: 4, nombre: 'Frijoles / Lentejas', unidad: '1/2 taza', carbos: 20 },
  { id: 5, nombre: 'Manzana / Naranja', unidad: '1 pieza mediana', carbos: 15 },
  { id: 6, nombre: 'Plátano', unidad: '1/2 pieza', carbos: 15 },
  { id: 7, nombre: 'Papa cocida', unidad: '1 pieza chica', carbos: 15 },
  { id: 8, nombre: 'Pasta cocida', unidad: '1/2 taza', carbos: 20 },
  { id: 9, nombre: 'Leche', unidad: '1 vaso (250 ml)', carbos: 12 },
  { id: 10, nombre: 'Avena cocida', unidad: '1/2 taza', carbos: 15 }
];

export default function FoodGuideCard({ onSelectCarbos, resetSignal }) {
  const [query, setQuery] = useState('');
  const [plato, setPlato] = useState([]);

  useEffect(() => {
    if (resetSignal) {
      setPlato([]);
      setQuery('');
    }
  }, [resetSignal]);

  const filteredFoods = FOOD_DATABASE.filter(item =>
    item.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const agregarAlPlato = (food) => {
    setPlato([...plato, food]);
  };

  const quitarDelPlato = (index) => {
    const nuevoPlato = [...plato];
    nuevoPlato.splice(index, 1);
    setPlato(nuevoPlato);
  };

  const totalCarbos = plato.reduce((acc, item) => acc + item.carbos, 0);

  const cargarACalculadora = () => {
    onSelectCarbos(totalCarbos);
  };

  return (
    <div className="card">
      <h2 className="card-title">Armar Mi Comida</h2>
      
      <input
        type="text"
        className="food-search"
        placeholder="¿Qué comiste hoy?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="food-list">
        {filteredFoods.map((food) => (
          <div key={food.id} className="food-item">
            <div>
              <strong style={{ fontSize: '0.88rem' }}>{food.nombre}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Porción: {food.unidad} (~{food.carbos}g carbos)
              </div>
            </div>
            <button onClick={() => agregarAlPlato(food)}>
              + Agregar
            </button>
          </div>
        ))}
      </div>

      {plato.length > 0 && (
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Mi plato ({plato.length} alimentos):
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.75rem' }}>
            {plato.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', background: '#f8fafc', padding: '0.3rem 0.5rem', borderRadius: '4px' }}>
                <span>{item.nombre} ({item.unidad})</span>
                <div>
                  <strong style={{ marginRight: '0.5rem' }}>{item.carbos}g</strong>
                  <button onClick={() => quitarDelPlato(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              Total estimado: {totalCarbos}g
            </span>
          </div>

          <button className="btn-primary" style={{ padding: '0.6rem', fontSize: '0.85rem' }} onClick={cargarACalculadora}>
            Usar {totalCarbos}g en Calculadora
          </button>
        </div>
      )}
    </div>
  );
}