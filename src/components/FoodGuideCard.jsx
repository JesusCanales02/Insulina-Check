import { useState } from 'react';
import './FoodGuideCard.css';

const BASE_FOODS = [
  { id: 1, nombre: 'Manzana (1 mediana)', carbos: 25 },
  { id: 2, nombre: 'Pan Integral (1 rebanada)', carbos: 15 },
  { id: 3, nombre: 'Arroz Blanco (1 taza cocida)', carbos: 45 },
  { id: 4, nombre: 'Avena (1/2 taza)', carbos: 27 },
  { id: 5, nombre: 'Tortilla de Maíz (1 pieza)', carbos: 12 },
  { id: 6, nombre: 'Plátano (1 mediano)', carbos: 27 },
  { id: 7, nombre: 'Pasta Cocida (1 taza)', carbos: 40 }
];

export default function FoodGuideCard({ onSelectCarbos }) {
  const [query, setQuery] = useState('');

  const filteredFoods = BASE_FOODS.filter(item =>
    item.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="card">
      <h2 className="card-title">🍎 Asistente de Carbohidratos</h2>
      <input
        type="text"
        className="food-search"
        placeholder="Buscar alimento (ej. Arroz, Pan...)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="food-list">
        {filteredFoods.map((food) => (
          <div key={food.id} className="food-item">
            <div>
              <strong style={{ fontSize: '0.9rem' }}>{food.nombre}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {food.carbos}g Carbohidratos
              </div>
            </div>
            <button onClick={() => onSelectCarbos(food.carbos)}>
              + Usar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}