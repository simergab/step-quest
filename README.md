# Step Quest

Step Quest e um jogo mobile web de caminhada. O jogador avanca no mapa conforme
da passos na vida real. Em navegadores/celulares que liberam `DeviceMotionEvent`,
o jogo tenta detectar movimento como pedometro simples. Para testar agora, o botao
`+1 passo` simula passos sem depender de sensores, e `-1 passo` corrige contagens
indevidas.

## Como jogar agora

Abra `index.html` no navegador do celular ou computador.

- Toque em `+1 passo` para simular caminhada imediatamente.
- No celular, toque em `Usar sensor` e caminhe com o aparelho na mao.
- Use `Calibrar` se a contagem do sensor parecer alta ou baixa.
- Complete fases para desbloquear cenarios.
- Ganhe pontos e moedas, depois gaste as moedas na `Loja de skins`.

## Modo online privado

O modo online foi feito para 2 jogadores em uma sala privada por codigo.

Link publico temporario atual:

```text
https://archives-tribune-promising-spelling.trycloudflare.com
```

Link publicado no Render:

```text
https://step-quest-503q.onrender.com
```

1. Abra o jogo pelo link publico acima. Se estiver na mesma rede Wi-Fi, tambem funciona em `https://192.168.1.6:8443`.
2. Na tela inicial, escreva seu nome e toque em `Criar sala`.
3. Envie o codigo da sala para seu amigo.
4. Seu amigo abre o mesmo link, escreve o nome, digita o codigo e toca em `Entrar`.
5. O jogo abre com a sala conectada. Se quiser jogar sozinho, toque apenas em `Play`.

O servidor guarda a sala apenas enquanto estiver rodando neste computador. Por
padrao, o link `192.168.1.6` funciona para pessoas na mesma rede Wi-Fi. Para um
amigo fora da sua rede, sera necessario publicar o jogo ou criar um tunel HTTPS.

## Sensor no celular

Sensores de movimento quase sempre exigem HTTPS. Para testar pela rede local,
use o servidor HTTPS:

```text
https://192.168.1.6:8443
```

Como o certificado e local e temporario, o celular pode mostrar um aviso de
seguranca antes de abrir. Se isso acontecer, decida no proprio celular se quer
continuar com o teste local. A alternativa sem aviso e publicar o jogo em uma
hospedagem HTTPS confiavel. Depois que a pagina carregar, toque em `Usar sensor`,
permita o movimento quando o navegador pedir e caminhe com o celular desbloqueado.
Se a contagem parecer alta ou baixa, toque em `Calibrar`, fique parado por cerca
de 3 segundos e volte a caminhar em ritmo normal.

## Funcionalidades

- Tela inicial com `Play` e `Exit`.
- Fases progressivas com 10 cenarios, de 20 ate 500 passos.
- Pontos por passo, bonus por ritmo no minuto e multiplicador de horas ativas.
- Loja com 12 skins compraveis com moedas virtuais, cada uma mudando cor da roupa e da pele.
- Feedback em tempo real: passos, pontos, calorias estimadas e progresso.
- Missoes, 12 conquistas, ranking pessoal e salvamento offline em `localStorage`.
- Sala online privada para ate 2 jogadores no servidor local.
- Vibracao e som curto quando o navegador permite.
- Credito discreto: created by Biel e Jenny.

## Observacao

Google Fit e Apple Health exigem app nativo, OAuth e aprovacao das plataformas.
Esta versao entrega uma alternativa web jogavel agora, com sensor de movimento
quando disponivel e simulacao de passos como fallback.
