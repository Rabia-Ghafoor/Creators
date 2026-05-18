import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../client"; // adjust path if needed
import CreatorCard from "../components/CreatorCard";

export default function ShowCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCreators() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("creators")
        .select("id, name, url, description, imageURL")
        .order("id", { ascending: false });

      if (!isMounted) return;

      if (error) {
        setErrorMsg(error.message || "Failed to load creators.");
        setCreators([]);
      } else {
        setCreators(data || []);
      }

      setLoading(false);
    }

    fetchCreators();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this creator? This cannot be undone.");
    if (!ok) return;

    const { error } = await supabase.from("creators").delete().eq("id", id);

    if (error) {
      alert(error.message || "Failed to delete creator.");
      return;
    }

    // Update UI immediately
    setCreators((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Creatorverse</h1>
        <Link to="/creators/new" role="button">
          + Add Creator
        </Link>
      </header>

      {loading && <p>Loading...</p>}
      {errorMsg && <p style={{ color: "crimson" }}>{errorMsg}</p>}

      {!loading && creators.length === 0 && (
        <p>No creators yet. Add one to get started.</p>
      )}

      {/* Responsive grid of cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {creators.map((c) => (
          <CreatorCard key={c.id} creator={c} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
