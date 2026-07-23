import { useState, useEffect } from 'react';
import './App.css'; // Importa o novo CSS

function App() {
  const [conselho, setConselho] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function buscarConselho() {
    setCarregando(true);
    try {
      // 1. Busca o conselho em inglês
      const resposta = await fetch('https://api.adviceslip.com/advice');
      const dados = await resposta.json();
      const textoIngles = dados.slip.advice;

      // 2. Traduz o conselho para o português
      const respostaTraducao = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textoIngles)}&langpair=en|pt-BR`
      );
      const dadosTraducao = await respostaTraducao.json();
      
      const textoTraduzido = dadosTraducao.responseData?.translatedText || textoIngles;
      setConselho(textoTraduzido);

    } catch (erro) {
      setConselho('Não foi possível carregar o conselho. Tente novamente!');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarConselho();
  }, []);

  return (
    // O fundo agora é controlado pelo CSS e tem a animação
    <div className="main-container">
      <div className="conselho-card">
        <h2 className="card-titulo">Conselho do Dia ✨</h2>

        <div className="card-texto-area">
          {carregando ? (
            <p className="card-carregando">Buscando inspiração...</p>
          ) : (
            <p className="card-conselho">
              "{conselho}"
            </p>
          )}
        </div>

        <button 
          onClick={buscarConselho}
          disabled={carregando}
          className="card-botao"
        >
          {carregando ? 'Carregando...' : 'Novo Conselho'}
        </button>
      </div>
    </div>
  );
}

export default App;