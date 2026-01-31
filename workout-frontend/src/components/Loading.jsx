import "../styles/Loading.css";
const Loading = () => {
  const frases = [
    "Você é mais forte do que pensa 💪",
    "Cada treino é um passo rumo à sua melhor versão!",
    "A constância vence o cansaço. Continue firme!",
    "Hoje é um ótimo dia para superar seus limites!",
    "Seu corpo ouve tudo o que sua mente diz. Pense forte!",
  ];
  return (
    <div className="loading-container">
      {" "}
      <div className="spinner" />   <p>{frases[Math.floor(Math.random() * frases.length)]}</p>{" "}
    </div>
  );
};
export default Loading;
