// Cria folhas animadas
function createLeaves() {
  const leavesContainer = document.getElementById('leaves-container');
  const leafTypes = 3;
  
  for (let i = 0; i < 15; i++) {
    const leaf = document.createElement('div');
    leaf.className = 'leaf';
    
    // Tipo de folha aleatório
    const leafType = Math.floor(Math.random() * leafTypes) + 1;
    leaf.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="%234caf50" d="M50 0 Q70 40 50 80 Q30 40 50 0" opacity="0.7"/></svg>')`;
    
    // Tamanho aleatório
    const size = Math.random() * 20 + 10;
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    
    // Posição inicial aleatória
    leaf.style.left = `${Math.random() * 100}vw`;
    leaf.style.top = `-${size}px`;
    
    // Duração e atraso da animação
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;
    leaf.style.animationDuration = `${duration}s`;
    leaf.style.animationDelay = `${delay}s`;
    
    // Movimento horizontal aleatório
    leaf.style.setProperty('--random-x', Math.random() * 0.5 + 0.25);
    
    leavesContainer.appendChild(leaf);
  }
}

// Inicia quando a página carrega
// Configuração do vídeo de fundo
document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('bg-video');
  video.playbackRate = 0.7; // Reduz a velocidade do vídeo
});