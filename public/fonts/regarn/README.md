# Fonte Regarn (display)

Coloque aqui os arquivos da fonte **Regarn** enviados pela produção.
O carregamento já está configurado via `@font-face` em `app/globals.css`.

## Arquivos esperados (renomeie conforme o que você recebeu)

```
/public/fonts/regarn/Regarn.woff2   ← recomendado (melhor compressão)
/public/fonts/regarn/Regarn.woff
/public/fonts/regarn/Regarn.otf
```

Assim que os arquivos estiverem nesta pasta, **todos os títulos** passam a
usar a Regarn automaticamente. Enquanto isso, o fallback (Montserrat pesada)
mantém os títulos com impacto, sem quebrar o layout.

> Se os nomes dos arquivos forem diferentes, ajuste os caminhos no bloco
> `@font-face` em `app/globals.css`.
