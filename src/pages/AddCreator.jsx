import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client"; // adjust path if your client.js is elsewhere

export default function AddCreator() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    imageURL: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Build payload (imageURL is optional)
    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      description: form.description.trim(),
      ...(form.imageURL.trim() ? { imageURL: form.imageURL.trim() } : {}),
    };

    const { error } = await supabase.from("creators").insert([payload]);

    if (error) {
      setErrorMsg(error.message || "Failed to add creator.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/");
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Add Creator</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />

        <input
          name="url"
          placeholder="Channel URL"
          value={form.url}
          onChange={onChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          required
        />

        <input
          name="imageURL"
          placeholder="Image URL (optional)"
          value={form.imageURL}
          onChange={onChange}
        />

        {errorMsg ? <p style={{ color: "crimson", margin: 0 }}>{errorMsg}</p> : null}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}
