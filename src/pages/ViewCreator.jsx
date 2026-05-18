import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../client"; // adjust path if needed

export default function ViewCreator() {
  const { id } = useParams();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCreator() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("creators")
        .select("id, name, url, description, imageURL")
        .eq("id", id)
        .single();

      if (!isMounted) return;

      if (error) {
        setErrorMsg(error.message || "Failed to load creator.");
        setCreator(null);
      } else {
        setCreator(data);
      }

      setLoading(false);
    }

    if (id) fetchCreator();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <h1>View Creator</h1>
        <p>Loading...</p>
        <Link to="/">Back</Link>
      </div>
    );
  }

  if (errorMsg || !creator) {
    return (
      <div style={{ padding: 16 }}>
        <h1>View Creator</h1>
        <p style={{ color: "crimson" }}>{errorMsg || "Creator not found."}</p>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/">Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, maxWidth: 600 }}>
      <h1>{creator.name}</h1>

      {creator.imageURL ? (
        <img
          src={creator.imageURL}
          alt={creator.name}
          style={{
            width: 260,
            height: 260,
            objectFit: "cover",
            borderRadius: 12,
            marginBottom: 12,
          }}
        />
      ) : (
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 12,
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          No image
        </div>
      )}

      <p>
        <strong>URL: </strong>
        <a href={creator.url} target="_blank" rel="noreferrer">
          {creator.url}
        </a>
      </p>

      <p>
        <strong>Description: </strong>
        {creator.description}
      </p>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <Link to={`/creators/${id}/edit`}>Edit</Link>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}
