# yt-custom-player

> Uma biblioteca para estilizar e personalizar o player do YouTube no React.

## Instalação

Para instalar a biblioteca, use o npm ou yarn:

```bash
npm install yt-custom-player
```

ou

```bash
yarn add yt-custom-player
```

## Uso

Implemente e use o componente `Player` no seu projeto React.

### Exemplo básico

```jsx
import React from 'react';
import Player from 'yt-custom-player';

const App = () => {
  return (
    <div>
      <h1>Minha aplicação com o player do YouTube estilizado</h1>
      <Player videoId="abc123" />
    </div>
  );
};

export default App;
```


## Propriedades

Essas são as propriedades suportadas pela biblioteca.

| Propriedade        | Tipo    | Descrição                                                     | Padrão  |
|--------------------|---------|---------------------------------------------------------------|---------|
| videoId            | string  | O ID do vídeo do YouTube a ser exibido.                       | null    |
| start              | number  | O tempo inicial em segundos para iniciar a reprodução do vídeo.| 0       |
| end                | number  | O tempo final em segundos para parar a reprodução do vídeo.    | 0       |
| autoplay           | bool    | Se o vídeo deve iniciar automaticamente.                      | false   |
| muted              | bool    | Se o vídeo deve ser reproduzido sem som.                       | false   |
| repeat             | bool    | Se o vídeo deve ser repetido automaticamente após o término.   | false   |
| showInicialOverlay | bool    | Se a sobreposição inicial deve ser exibida.                    | true    |
| showPlayPauseBtn   | bool    | Se o botão de play/pause deve ser exibido.                     | true    |
| showMuteBtn        | bool    | Se o botão de mute/desmutar deve ser exibido.                  | true    |
| showProgressBar    | bool    | Se a barra de progresso do vídeo deve ser exibida.             | true    |
| aspectRatio        | string  | Define a proporção do player (ex: '16:9', '4:3').             | '16:9'  |
| fullScreen         | bool    | Se o modo de tela cheia deve estar habilitado.                 | true    |

## Contribuição

Se você deseja contribuir com a biblioteca, fique à vontade para fazer um fork e enviar pull requests. Certifique-se de seguir as boas práticas de codificação e de incluir testes sempre que possível.

1. Faça um fork deste repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/nova-feature`).
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.
