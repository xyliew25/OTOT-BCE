export async function getQuotes() {
  const res = await fetch('http://localhost:8000/api/quotes');
  return await res.json();
}

export async function getQuote(id) {
  const res = await fetch(`http://localhost:8000/api/quotes?id=${id}`);
  return await res.json();
}

export async function createQuote(data) {
  const res = await fetch('http://localhost:8000/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function editQuote(id, data) {
  const res = await fetch(`http://localhost:8000/api/quotes?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteQuote(id) {
  const res = await fetch(`http://localhost:8000/api/quotes?id=${id}`, {
    method: 'DELETE',
  });
  return await res.json();
}
