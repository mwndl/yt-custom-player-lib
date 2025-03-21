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

Aqui você pode listar as propriedades que seu componente suporta.

| Propriedade  | Tipo   | Descrição                                              | Padrão |
|--------------|--------|--------------------------------------------------------|--------|
| videoId      | string | O ID do vídeo do YouTube a ser exibido.               | null   |
| autoplay     | bool   | Se o vídeo deve iniciar automaticamente.              | false  |
| controls     | bool   | Se os controles do player devem ser exibidos.         | true   |
| theme        | string | Define o tema (ex: 'dark', 'light').                  | light  |

## Customização

Você pode personalizar o estilo do player usando CSS. Exemplo:

```css
.yt-custom-player {
  border-radius: 8px;
  overflow: hidden;
}
```

## Contribuição

Se você deseja contribuir com a biblioteca, fique à vontade para fazer um fork e enviar pull requests. Certifique-se de seguir as boas práticas de codificação e de incluir testes sempre que possível.

1. Faça um fork deste repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Envie para o repositório remoto (`git push origin feature/nova-feature`).
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.
