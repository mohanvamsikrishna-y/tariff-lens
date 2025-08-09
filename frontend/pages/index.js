import React from 'react';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f5f0e6', padding: '2rem' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: '2rem' }}>Tariff Lens</h1>
      <section style={{ marginTop: '1rem' }}>
        <h2>Tariff Table</h2>
        {/* TODO: replace with dynamic table */}
        <div>Table placeholder</div>
      </section>
      <section style={{ marginTop: '2rem' }}>
        <h2>AI Chat</h2>
        {/* TODO: replace with chat component */}
        <div>Chat box placeholder</div>
      </section>
    </main>
  );
}
