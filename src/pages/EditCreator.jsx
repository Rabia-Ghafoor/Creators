import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../client";

export default function EditCreator() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    url: "",
    description: "",
    imageURL: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCreator() {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("creators")
        .select("id, name, url, description, imageURL")
        .eq("id", Number(id))
        .single();

      if (!isMounted) return;

      if (error) {
        setErrorMsg(error.message || "Failed to load creator.");
        setLoading(false);
        return;
      }

      setForm({
        name: data?.name ?? "",
        url: data?.url ?? "",
        description: data?.description ?? "",
        imageURL: data?.imageURL ?? "",
      });

      setLoading(false);
    }

    if (id) {
      loadCreator();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const onChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    if (!form.name.trim() || !form.url.trim() || !form.description.trim()) {
      setErrorMsg("Please fill out name, url, and description.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      description: form.description.trim(),
      imageURL: form.imageURL.trim() ? form.imageURL.trim() : null,
    };

    const { error } = await supabase
      .from("creators")
      .update(payload)
      .eq("id", Number(id));

    if (error) {
      setErrorMsg(error.message || "Failed to update creator.");
      setSaving(false);
      return;
    }

    setSaving(false);
    navigate(`/creators/${id}`);
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete this creator? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);
    setErrorMsg("");

    const { error } = await supabase
      .from("creators")
      .delete()
      .eq("id", Number(id));

    if (error) {
      setErrorMsg(error.message || "Failed to delete creator.");
      setDeleting(false);
      return;
    }

    setDeleting(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Edit Creator</h1>
        <p>Loading...</p>

        <div style={{ marginTop: 12 }}>
          <Link to={`/creators/${id}`}>Cancel</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Edit Creator</h1>

      {errorMsg ? <p style={{ color: "crimson" }}>{errorMsg}</p> : null}

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 500 }}
      >
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

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" disabled={saving || deleting}>
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={saving || deleting}
            style={{ background: "crimson", color: "white" }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        <Link to={`/creators/${id}`}>Cancel</Link>
      </div>
    </div>
  );
}