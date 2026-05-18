import { Link } from "react-router-dom";

export default function CreatorCard({ creator, onDelete }) {
  const { id, name, url, description, imageURL } = creator;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 10 }}>
      {imageURL ? (
        <img
          src={imageURL}
          alt={name}
          style={{ width: "100%", maxWidth: 320, borderRadius: 10 }}
        />
      ) : null}

      <h3>{name}</h3>
      <p>{description}</p>

      <p>
        <a href={url} target="_blank" rel="noreferrer">
          Visit channel
        </a>
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <Link to={`/creators/${id}`}>View</Link>
        <Link to={`/creators/${id}/edit`}>Edit</Link>
        <button onClick={() => onDelete(id)}>Delete</button>
      </div>
    </div>
  );
}
