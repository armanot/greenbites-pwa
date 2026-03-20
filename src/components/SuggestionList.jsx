function SuggestionList({ items }) {
  return (
    <div className="panel">
      <h3>Cadangan pantas</h3>
      <ul className="suggestion-list">
        {items.map((item) => (
          <li key={item}>
            <span className="bullet">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SuggestionList
