# nd-profile-core

Core de modelagem de neurodivergência para qualquer ferramenta que aceite a estrutura. Contratos de domínio (tipos, vocabulários e montagem do perfil) agnósticos de framework — NestJS, Fastify, Express, React, CLI.

Biblioteca **framework-agnostic**, **sem dependências de runtime**, **ESM-only**, Node >= 20.19.

> **Este core é uma especificação de estrutura de dados.** Ele não realiza diagnóstico, não emite conclusões, não processa dados de pacientes, não substitui avaliação profissional e **não constitui dispositivo médico**. Os campos `Condition` e `Diagnosis` são **rótulos de modelagem** —names de campos que descrevem *onde* uma afirmação se encaixa — e não afirmações clínicas. Nenhum valor é produzido, validado ou interpretado por esta biblioteca.

> **Não afiliado** a "accessibility passports" governamentais ou comerciais (como o *Workplace Accessibility Passport* do serviço público federal canadense), nem a schemas de "cognitive passport" publicados (como o `@p31/cognitive-passport-schema`, AGPL-3.0). "Profile", aqui, é o nome genérico da visão filtrada de asserções — não o produto de nenhum fornecedor.

> **Não é recomendação nem padrão de mercado.** A biblioteca é publicada como infraestrutura. Nenhuma organização a endossa, certifica ou recomenda.

---

## 1. Instalação

```bash
npm install nd-profile-core
```

```ts
import { ProfileService, describeAssertion } from 'nd-profile-core';
import type { Assertion, Consent, User } from 'nd-profile-core';
```

Importação por subpath:

```ts
import { ProfileService } from 'nd-profile-core/profile';
import type { Assertion } from 'nd-profile-core/assertion';
```

Subpaths: `audience`, `assertion`, `consent`, `facet`, `geography`, `profile`, `schooling`, `shared`, `user`.

---

## 2. Licença e garantia

- **Schema, tipos e documentação:** [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) — domínio público. Uso livre, sem atribuição obrigatória.
- **Código de referência e validadores:** [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).

Arquivos: [`LICENSE`](./LICENSE) (Apache-2.0, código) e [`LICENSE-SCHEMA.md`](./LICENSE-SCHEMA.md) (CC0 1.0, schema e documentação). Cada arquivo em `src/` carrega o identificador `SPDX-License-Identifier: Apache-2.0`.

A separação é intencional: o schema precisa ser adotável por qualquer ferramenta, inclusive comercial, sem atrito jurídico. O código de referência mantém a cláusula de patente do Apache-2.0, que dá segurança a adotantes corporativos.

**O schema está disponível em JSON Schema**, de forma independente do código:

```json
{
  "$id": "https://github.com/camilabm/nd-profile-core/schema/nd-profile-core.schema.json"
}
```

Está em [`schema/nd-profile-core.schema.json`](./schema/nd-profile-core.schema.json), sob CC0 1.0. Quem quiser implementar a estrutura em outra linguagem — ou reescrever os tipos a partir do contrato — pode fazê-lo sem tocar em código sob Apache-2.0.

**Nenhuma garantia é fornecida**, incluindo ausência de vícios, comercionalidade ou adequação a uma finalidade específica. O uso é por conta e risco do usuário. A biblioteca não é um dispositivo médico, não é um instrumento de avaliação e não produz resultado clínico algum.

### Marca

O nome `nd-profile-core` **não** é licenciado junto com o schema, e nenhum uso deste README deve ser lido como concessão de direito de marca. Uso do nome para indicar compatibilidade segue a política da Seção 12.

> **Nota sobre a declaração de conformidade.** O que a Seção 12 descreve é uma **declaração de conformidade** — um checklist público que o implementador pode alegar cumprir. **Não é um selo de conformidade** no sentido de marca de certificação: não é registrado, não é emitido por autoridade reconhecedora, e não produz efeito de garantia. O mantenedor não é autoridade certificadora e não assume obrigação de fiscalizar implementadores. Alegar conformidade a um padrão de fato não cumprido é responsabilidade de quem alega.

---

## 3. Modelo mental

```
User ──┬──< Assertion   afirmações sobre a pessoa
       └──< Consent     autorização de compartilhamento, com prazo
```

- **Assertion** — uma afirmação factual sobre a pessoa, sempre com um **facet** (eixo temático) e uma **construct** (medida ou descrição).
- **Facet** — a categoria da afirmação: `{ type, areas, attribute }`.
- **Consent** — o que e com quem pode ser compartilhado, e até quando.
- **Profile** — a visão filtrada dessas asserções para uma audiência.

---

## 4. Exemplo sintético

> **Exemplo fictício.** Todos os dados abaixo são inventados para demonstrar o modelo. Nenhum caso clínico real, nenhum instrumento de avaliação e nenhum profissional identificável são representados. Nomes, IDs, datas e valores não correspondem a pessoa alguma.

Ao longo deste documento, "Pessoa A" é o sujeito fictício do exemplo.

```ts
const pessoaA: User = {
  id: 'usr_example',
  name: 'Pessoa A',
  email: 'pessoa.a@example.com',
  role: 'Individual',
  birthDate: new Date('1994-01-01'),
  region: 'southeast',
  state: 'SP',
  schooling: 'CompleteHigherEducation',
  pseudonymizedId: 'pm_example',
  createdAt: new Date('2024-01-01T09:00:00Z'),
  updatedAt: new Date('2024-06-01T12:00:00Z'),
};
```

> **Não copie este formato para produção.** Em ambiente real, **não inclua nome, e-mail ou data de nascimento no core**. O tipo `User` os carrega por compatibilidade com sistemas que já os têm, mas o core não precisa de nenhum deles para funcionar: `ProfileService.build()` consome apenas `userId`, `assertions` e `consents`. Prefira `pseudonymizedId` e atributos de contexto (`region`, `state`, `schooling`) que não identificam a pessoa diretamente.
>
> **`pseudonymizedId` é pseudonimização, não anonimização.** Um dado pseudonimizado ainda é **dado pessoal** sob a LGPD (art. 13, §4º): pode ser reassociado por meio de informações adicionais guardadas separadamente. Só a anonimização irreversível (art. 12) retira o dado do regime legal — e ela é irreversível por definição. Ver a Seção 13.

---

## 5. Preenchendo

### 5.1 `User`

| Campo | Como preencher |
|---|---|
| `role` | `Individual` · `Professional` · `Admin` |
| `region` | `southeast` · `northeast` · `south` · `north` · `central_west` |
| `state` | Sigla da UF — `SP`, `RJ`, `BA`, … (27 opções) |
| `schooling` | `None` · `IncompletePrimary` · `CompletePrimary` · `IncompleteSecondary` · `CompleteSecondary` · `IncompleteHigherEducation` · `CompleteHigherEducation` |

`getRegionByState('SP')` devolve `'southeast'`; `getSchoolingYearsRange('CompleteHigherEducation')` devolve `'12+'`.

### 5.2 `Assertion`

```ts
const atencao: Assertion = {
  id: 'asr_example_attention',
  userId: 'usr_example',
  authorId: 'prof_example',
  createdAt: new Date('2024-06-01T12:00:00Z'),
  branch: 'Functioning',
  type: 'Difficulty',
  facet: {
    type: 'Cognition',
    areas: ['Function', 'Activity'],
    attribute: 'attention',
  },
  value: 'high impact',
  construct: 'sustained attention and task persistence',
  source: { kind: 'professional_evaluation', date: new Date('2024-05-01') },
  polarity: 'higher_is_more_symptoms',
  status: 'Confirmed',
};
```

| Campo | Como preencher |
|---|---|
| `branch` | `Condition` · `Functioning` · `Context` · `Preference` |
| `type` | `Diagnosis` · `Strength` · `Difficulty` · `Need` |
| `status` | `Confirmed` quando há avaliação profissional · `Suggestive` quando é relato ou enquadramento em aberto |
| `polarity` | `higher_is_more_symptoms` · `higher_is_better` · `neutral` · `lower_is_better` · `lower_is_more_symptoms` |
| `source.kind` | `document` (exige `fileId`) · `self_report` · `professional_evaluation` |
| `value` | A medida ou descrição — `number`, `string` ou categoria. Prefira descrições funcionais a escores brutos |
| `construct` | O nome da medida, em linguagem funcional. Sem nome de instrumento, sem percentil, sem grau de laudo |

**A origem dos dados:**

```ts
// avaliação conduzida por profissional habilitado
source: { kind: 'professional_evaluation', date: new Date('2024-05-01') }

// documento anexado, referenciado por ID (o conteúdo não faz parte do core)
source: { kind: 'document', date: new Date('2024-06-01'), fileId: 'file_example' }

// relato da própria pessoa
source: { kind: 'self_report', date: new Date('2024-02-01') }
```

> O core **não armazena documentos**. `fileId` é uma referência opaca ao armazenamento de quem implementa. Nenhum conteúdo clínico, endereço, telefone ou medicação pertence ao core.
>
> `professional_evaluation` indica que **um profissional habilitado** fez a afirmação. O core não verifica habilitação, não confere credencial e não autentica o `authorId`. A verificação é responsabilidade de quem implementa.

### 5.3 `Consent`

```ts
const consentEmpresa: Consent = {
  id: 'cns_example_company',
  userId: 'usr_example',
  targetAudience: 'Company',
  sharedAssertionIds: [
    'asr_example_attention',
    'asr_example_need_one_task',
  ],
  expiresAt: new Date('2024-12-31T23:59:59Z'),
  revoked: false,
};
```

| Campo | Como preencher |
|---|---|
| `targetAudience` | `Personal` · `Company` |
| `sharedAssertionIds` | IDs das asserções que essa audiência pode ver — **enumere, não automatize** |
| `expiresAt` | Data no futuro. Passada, o consentimento é ignorado em silêncio |
| `revoked` | `true` revoga imediatamente |

O consentimento é **da pessoa**. `Personal` significa que a pessoa acessa o próprio perfil — nenhum consentimento é necessário, porque se trata do titular do dado. `Company` significa que a pessoa autorizou o empregador a ver um conjunto enumerado de asserções.

Enumere sempre. Não derive o compartilhamento por regra automática — "todas as asserções `Difficulty`" ou "todas as `Condition`" — porque consentimento enumerado é o que torna a revogação e a auditoria possíveis.

---

## 6. Uso corporativo (`Company`)

`targetAudience: 'Company'` existe para que **a própria pessoa** compartilhe, voluntariamente e de forma enumerada, as informações de adaptação que deseja que o empregador conheça, com o fim de **adaptação razoável** — ambiente acessível, instruções em formatos específicos, ajustes de rotina, organização de tarefas.

**Não é um mecanismo de rastreamento, inventário ou classificação de funcionários.** O core não tem nenhuma função de categorizar pessoas para o empregador; ele apenas entrega, para a audiência escolhida, o conjunto de asserções que a pessoa autorizou.

### O que o core faz e o que não faz

| Camada | Quem define | O que entra |
|---|---|---|
| **Core** | o mantenedor | A estrutura da asserção, a regra de consentimento, a filtragem por audiência |
| **Ambiente do empregador** | quem implementa | Quem vê, por quanto tempo fica, se vira relatório, se integra com folha, se some depois de um prazo |

O core entrega um `ProfileView` filtrado. **O que o empregador faz com esse objeto depois é inteiramente fora do escopo do core.** O core não define retenção, controle de acesso, finalidade de uso nem integração com outros sistemas. Ele não amplia o que a pessoa compartilhou: se o empregador quiser saber algo que a pessoa **não** compartilhou, não consegue obtê-lo através do core.

### Obrigações de quem implementa

A relação de trabalho é desigual, e isso tem consequência jurídica direta. Em especial:

- **Base legal.** A LGPD restringe o uso de consentimento como base legal em relações de trabalho, por causa do desequilíbrio de poder entre empregador e empregado. Quando o compartilhamento serve à adaptação razoável, a base legal mais robusta é o **cumprimento de obrigação legal** — notadamente o dever de ambiente de trabalho acessível e inclusivo do art. 34, §1º, da Lei 13.146/2015 (LBI), e as normas de saúde ocupacional (NR-7), e não o consentimento isolado. Quem implementa deve **fundamentar a base legal por escrito** antes de usar o core em contexto de RH.
- **Minimização do acesso.** O dado sensível deve circular apenas por pessoal designado — RH, saúde ocupacional, encarregado de dados — e **não** por gestores diretos, colegas ou comitês de avaliação de desempenho.
- **Vedação de uso decisório.** O dado **não pode** ser usado para decisão de demissão, avaliação de desempenho, promoções, classificação de risco ou qualquer outra finalidade discriminatória. A LBI veda discriminação em razão da condição da pessoa com deficiência inclusive nas etapas de recrutamento, seleção, contratação, admissão e exames (art. 34, §3º), e veda a exigência de aptidão plena.
- **Sigilo do prontuário.** O empregador não acessa o laudo nem o prontuário de saúde ocupacional: recebe, no máximo, atestado de aptidão com restrições ou a informação funcional necessária à adaptação. A NR-7 (item 7.6.1.1) determina a guarda do prontuário sob **acesso restrito** — RH, gestores e qualquer profissional não-médico ficam de fora — e o dever de sigilo é ancorado no Código de Ética Médica.
- **Retenção e eliminação.** Defina prazo de retenção e rotina de eliminação. Ver a Seção 15.
- **Base legal e transparência.** Informe o empregado, de forma clara e acessível, que o tratamento está ocorrendo e com que finalidade — e registre essa informação.
- **Riscos psicossociais.** Desde 26 de maio de 2026, a NR-1 exige que os riscos psicossociais sejam identificados, avaliados e controlados no Gerenciamento de Riscos Ocupacionais (GRO), junto do inventário de riscos e do plano de ação. Isso disciplina o **ambiente de trabalho**, não este schema — mas implementadores que cuidem de adaptações individuais devem alinhá-las ao PGR da empresa em vez de tratarem o perfil como caso isolado. A NR-1 disciplina o ambiente, não o perfil individual: o core não substitui o PGR nem serve como inventário de riscos psicossociais.
- **Integração com sistemas existentes.** Se o perfil acabar alimentando o eSocial (evento S-2220, *Monitoramento da Saúde do Trabalhador*), a interface é do implementador: o evento é alimentado por dados de atestados de saúde ocupacional, com layouts e prazos próprios. O core não tem qualquer integração com sistemas oficiais, e não deve ser usado como fonte para eles.

O core **não implementa, não verifica e não garante** conformidade com nenhuma dessas obrigações. Ele não sabe se a base legal é adequada, se o acesso está restrito, se o dado foi usado para demissão, ou se a retenção está correta. Ver a Seção 15.

### Checklist antes de usar em contexto corporativo

Não é orientação jurídica — é a lista mínima de perguntas que evitam os erros mais comuns:

- Qual é a base legal do tratamento? Consentimento, obrigação legal, ou outra? Está fundamentada por escrito?
- Quem acessa os dados? O acesso está limitado ao mínimo necessário, e é auditável?
- Por quanto tempo os dados são retidos? Existe rotina de eliminação após revogação?
- Os dados podem ser usados para decisões de RH — promoção, demissão, avaliação de desempenho? **Recomendação: não.**
- O empregado sabe que o dado é tratado, por quem e com que finalidade?
- O que acontece quando a pessoa revoga o consentimento? O que já foi persistido, e quem apaga?

### Sobre a presunção de dispensa discriminatória

Existe entendimento sumulado do TST (Súmula 443) de que a despedida de empregado portador de doença grave que suscita estigma ou preconceito presume-se discriminatória, invertendo o ônus da prova. **Esse entendimento é lido restritivamente e, em regra, não alcança a neurodivergência** — a jurisprudência exige doença que efetivamente incite estigma ou preconceito, o que não é a regra em casos de TDAH ou TEA.

O risco relevante aqui não é a Súmula 443, e sim a combinação de três fatores: a vedação de discriminação e de exigência de aptidão plena da LBI (art. 34, §3º), o dever de adaptação razoável, e a proteção reforçada dos dados sensíveis de saúde sob a LGPD. Implementadores em contexto de RH devem tratar a transparência total sobre o uso do dado como obrigação, não como opção.

> **Nota de escopo.** A Seção 13 descreve o regime de dados pessoais; a Seção 14, os limites regulatórios e deontológicos aplicáveis a quem implementa. Nenhuma das duas é implementada por esta biblioteca.

---

## 7. `branch` × `type`: qual escolher

`branch` responde *onde* a afirmação se encaixa; `type` responde *que natureza* ela tem. São eixos independentes — a combinação é que dá o significado.

| `branch` | Serve para | `type` típico | Exemplo sintético |
|---|---|---|---|
| `Condition` | O que a pessoa **é** — quadro, diagnóstico, enquadramento | `Diagnosis` | condição de atenção (enquadramento sugestivo) |
| `Functioning` | O que a pessoa **faz** — desempenho medido | `Strength` | raciocínio dentro do esperado |
| `Functioning` | O que a pessoa **faz** — desempenho medido | `Difficulty` | atenção sustentada com alto impacto |
| `Functioning` | O que a pessoa **faz** — desempenho medido | `Need` | necessidade de apoio em reciprocidade social |
| `Context` | Em que **situação** aparece — queixa situacional ou recomendação | `Difficulty` | sensibilidade a mudanças de rotina |
| `Context` | Em que **situação** aparece — queixa situacional ou recomendação | `Need` | higiene do sono; uma tarefa por vez |
| `Preference` | O que a pessoa **quer** — preferência declarada | `Need` | prefere instruções por escrito antes da reunião |

**Regras de decisão na prática:**

1. **É um diagnóstico ou enquadramento?** → `Condition` + `Diagnosis`.
2. **É um resultado de avaliação?** → `Functioning` + `Strength` (preservado) ou `Difficulty` (prejudicado).
3. **É um sintoma que só se manifesta em contexto específico?** → `Context` + `Difficulty`.
4. **É uma coisa que a pessoa precisa que aconteça?** → `Context` + `Need`.
5. **É o que a pessoa quer, e não um defeito?** → `Preference` + `Need`.
6. **Falta de dados ou ainda não confirmado?** → `status: 'Suggestive'`, independentemente do `type`.

### Onde cada tipo de achado vive

| Achado | `facet.type` | `attribute` |
|---|---|---|
| atenção, impulsividade, autorregulação | `Cognition` | `attention` |
| raciocínio, eficiência cognitiva | `Cognition` | `reasoning` |
| memória, aprendizagem | `Cognition` | `memory` |
| linguagem expressiva | `Communication` | `verbal` |
| processamento visual | `Learning` | `visual` |
| reciprocidade social | `Social` | `social_interaction` |
| estresse, humor, regulação emocional | `Regulation` | `stress` |
| energia, fadiga | `Regulation` | `energy` |
| sono | `Regulation` | `sleep` |
| apoio profissional | `Cognition` | `professional_support` |
| instruções por escrito | `Communication` | `written` |

---

## 8. Facets: atributos conhecidos e livres

`facet.attribute` aceita **qualquer string** — o tipo `Open<T>` mantém os valores do vocabulário com autocomplete, mas não bloqueia novos. `Environment` não tem atributos definidos, então qualquer rótulo serve ali.

Para restringir estaticamente ao conjunto de um facet:

```ts
import type { FacetAttributesOf } from 'nd-profile-core';

const attr: FacetAttributesOf<'Learning'> = 'visual';
```

Para validar em runtime (dados vindos de fora):

```ts
import { facetAttributesFor } from 'nd-profile-core';

function assertFacetValid(facet: Facet): void {
  if (!facetAttributesFor(facet.type).includes(facet.attribute as never)) {
    throw new Error(`Atributo "${facet.attribute}" inválido para ${facet.type}`);
  }
}
```

### Independência em relação a classificações internacionais

O vocabulário de `facet` é **original deste projeto**. Ele não reproduz, não traduz e não adapta categorias da **ICF** (International Classification of Functioning, Disability and Health) da OMS, nem do **ICD-11**.

Isso é deliberado, e tem motivo jurídico. As classificações da OMS são protegidas por direito autoral e licenciadas pela OMS sob **CC BY-ND 3.0 IGO** — licença que **proíbe adaptações** e, expressamente, **exclui do escopo da licença** a produção de *crosswalks* (mapas entre classificações) e de traduções, que dependem de **acordo escrito separado com a OMS**. Um schema publicado em domínio público não pode, ao mesmo tempo, ser um derivado de material sob NoDerivs.

Consequência prática: **este repositório não publica crosswalk entre `nd-profile-core` e ICF/ICD-11.** Se sua ferramenta precisar de um, trate-o como projeto próprio, com análise jurídica própria, e considere obter a licença aplicável à OMS. O mesmo vale para o código de categoria (`b140`, `d710`, …) e para as URIs de classificação: nada disso é usado aqui.

---

## 9. Conjunto completo de asserções do exemplo sintético

```ts
import type { Assertion } from 'nd-profile-core';

const assertions: Assertion[] = [
  // ── Condition / Diagnosis ────────────────────────────────────────────
  {
    id: 'asr_example_condition_attention',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Condition',
    type: 'Diagnosis',
    facet: { type: 'Cognition', areas: ['Function'], attribute: 'attention' },
    value: 'attention-related condition (suggestive framing)',
    construct: 'condition framing',
    source: { kind: 'document', date: new Date('2024-06-01'), fileId: 'file_example' },
    status: 'Suggestive',
  },
  {
    id: 'asr_example_condition_social',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Condition',
    type: 'Diagnosis',
    facet: { type: 'Social', areas: ['Function'], attribute: 'social_interaction' },
    value: 'social reciprocity condition (suggestive framing)',
    construct: 'social framing',
    source: { kind: 'document', date: new Date('2024-06-01'), fileId: 'file_example' },
    status: 'Suggestive',
  },

  // ── Functioning / Strength ───────────────────────────────────────────
  {
    id: 'asr_example_reasoning',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Functioning',
    type: 'Strength',
    facet: { type: 'Cognition', areas: ['Function'], attribute: 'reasoning' },
    value: 'within expected range',
    construct: 'general reasoning',
    source: { kind: 'professional_evaluation', date: new Date('2024-03-01') },
    polarity: 'higher_is_better',
    status: 'Confirmed',
  },
  {
    id: 'asr_example_verbal',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Functioning',
    type: 'Strength',
    facet: { type: 'Communication', areas: ['Function'], attribute: 'verbal' },
    value: 'within expected range',
    construct: 'expressive language',
    source: { kind: 'professional_evaluation', date: new Date('2024-03-01') },
    polarity: 'higher_is_better',
    status: 'Confirmed',
  },

  // ── Functioning / Difficulty ──────────────────────────────────────────
  {
    id: 'asr_example_attention',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Functioning',
    type: 'Difficulty',
    facet: { type: 'Cognition', areas: ['Function', 'Activity'], attribute: 'attention' },
    value: 'high impact',
    construct: 'sustained attention and task persistence',
    source: { kind: 'professional_evaluation', date: new Date('2024-05-01') },
    polarity: 'higher_is_more_symptoms',
    status: 'Confirmed',
  },
  {
    id: 'asr_example_memory',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Functioning',
    type: 'Difficulty',
    facet: { type: 'Cognition', areas: ['Function'], attribute: 'memory' },
    value: 'moderate impact',
    construct: 'verbal learning and memory',
    source: { kind: 'professional_evaluation', date: new Date('2024-04-01') },
    polarity: 'higher_is_better',
    status: 'Confirmed',
  },
  {
    id: 'asr_example_stress',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Functioning',
    type: 'Difficulty',
    facet: { type: 'Regulation', areas: ['Function'], attribute: 'stress' },
    value: 'mild impact',
    construct: 'anxiety-related symptoms',
    source: { kind: 'professional_evaluation', date: new Date('2024-04-01') },
    status: 'Confirmed',
  },
  {
    id: 'asr_example_social',
    userId: 'usr_example',
    authorId: 'usr_example',
    createdAt: new Date('2024-05-01T15:00:00Z'),
    branch: 'Functioning',
    type: 'Need',
    facet: { type: 'Social', areas: ['Activity'], attribute: 'social_interaction' },
    value: 'consistent support needed',
    construct: 'social reciprocity',
    source: { kind: 'self_report', date: new Date('2024-05-01') },
    polarity: 'higher_is_more_symptoms',
    status: 'Suggestive',
  },

  // ── Context / Difficulty e Need ───────────────────────────────────────
  {
    id: 'asr_example_routine',
    userId: 'usr_example',
    authorId: 'usr_example',
    createdAt: new Date('2024-02-01T09:30:00Z'),
    branch: 'Context',
    type: 'Difficulty',
    facet: { type: 'Cognition', areas: ['Activity'], attribute: 'attention' },
    value: 'sensibilidade a mudanças de rotina',
    construct: 'routine changes (self-report)',
    source: { kind: 'self_report', date: new Date('2024-02-01') },
    status: 'Suggestive',
  },
  {
    id: 'asr_example_need_sleep',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Context',
    type: 'Need',
    facet: { type: 'Regulation', areas: ['Activity'], attribute: 'sleep' },
    value: 'earlier sleep and reduced screen exposure before bed',
    construct: 'sleep hygiene',
    source: { kind: 'document', date: new Date('2024-06-01'), fileId: 'file_example' },
    status: 'Confirmed',
  },
  {
    id: 'asr_example_need_one_task',
    userId: 'usr_example',
    authorId: 'prof_example',
    createdAt: new Date('2024-06-01T12:00:00Z'),
    branch: 'Context',
    type: 'Need',
    facet: { type: 'Regulation', areas: ['Activity'], attribute: 'energy' },
    value: 'one task at a time',
    construct: 'task organization',
    source: { kind: 'document', date: new Date('2024-06-01'), fileId: 'file_example' },
    status: 'Confirmed',
  },

  // ── Preference / Need ─────────────────────────────────────────────────
  {
    id: 'asr_example_pref_written',
    userId: 'usr_example',
    authorId: 'usr_example',
    createdAt: new Date('2024-02-01T09:30:00Z'),
    branch: 'Preference',
    type: 'Need',
    facet: { type: 'Communication', areas: ['Activity'], attribute: 'written' },
    value: 'prefers written instructions before meetings',
    construct: 'communication preference',
    source: { kind: 'self_report', date: new Date('2024-02-01') },
    status: 'Confirmed',
  },
];
```

---

## 10. A saída

`ProfileService.build()` filtra as asserções conforme a audiência e os consentimentos ativos e devolve a visão.

```ts
import { ProfileService } from 'nd-profile-core';

const profile = new ProfileService().build({
  userId: 'usr_example',
  visibility: 'Company',
  assertions,
  consents: [consentEmpresa],
  now: new Date('2024-06-01T13:00:00Z'),
});
```

### Regras

| `visibility` | O que aparece |
|---|---|
| `Personal` | Todas as asserções da própria pessoa. `expiresAt` é sempre `null` |
| `Company` | Apenas as asserções listadas em consentimentos **ativos** para essa audiência |

Consentimento ativo = mesmo `userId`, mesmo `targetAudience`, `revoked: false` e `expiresAt` no futuro.

`expiresAt` do profile = a **menor** expiração entre os consentimentos ativos. Asserções de outro `userId` são sempre ignoradas.

### O que volta

```ts
{
  userId: 'usr_example',
  visibility: 'Company',
  visibleAssertions: [ /* AssertionView[] */ ],
  generatedAt: new Date('2024-06-01T13:00:00Z'),
  expiresAt: new Date('2024-12-31T23:59:59Z'),
}
```

Cada `AssertionView`:

```ts
{
  id: 'asr_example_attention',
  branch: 'Functioning',
  type: 'Difficulty',
  facet: {
    type: 'Cognition',
    areas: ['Function', 'Activity'],
    attribute: 'attention',
  },
  value: 'high impact',
  construct: 'sustained attention and task persistence',
  status: 'Confirmed',
  polarity: 'higher_is_more_symptoms',
  description: 'Cognition / attention: sustained attention and task persistence = high impact',
}
```

`polarity` é omitido — não `undefined` — quando não foi definido.

### Saída da audiência empresa

```ts
const profile = new ProfileService().build({
  userId: 'usr_example',
  visibility: 'Company',
  assertions,
  consents: [consentEmpresa],
  now: new Date('2024-06-01T13:00:00Z'),
});

console.log(profile.visibleAssertions.map((a) => a.description));
```

```
'Cognition / attention: sustained attention and task persistence = high impact'
'Regulation / energy: task organization = one task at a time'
```

Nada além do que a pessoa autorizou — nem diagnóstico, nem enquadramento, nem a totalidade das asserções. Se a pessoa quiser incluir uma asserção de `Condition` no consentimento de `Company`, o core a entrega: o consentimento é dela. O que a empresa faz com isso é responsabilidade dela, e é onde mora o risco jurídico (Seção 6).

```
profile.expiresAt  // 2024-12-31T23:59:59.000Z
```

### Saída da audiência pessoal

```ts
const profile = new ProfileService().build({
  userId: 'usr_example',
  visibility: 'Personal',
  assertions,
  consents: [],
  now: new Date('2024-06-01T13:00:00Z'),
});

profile.visibleAssertions.length; // 12 — todas as asserções da própria pessoa
profile.expiresAt;                // null
```

### Revogação e expiração

```ts
// revogado
new ProfileService().build({
  userId: 'usr_example', visibility: 'Company', assertions,
  consents: [{ ...consentEmpresa, revoked: true }],
  now: new Date('2024-06-01T13:00:00Z'),
}).visibleAssertions; // []

// expirado
new ProfileService().build({
  userId: 'usr_example', visibility: 'Company', assertions,
  consents: [{ ...consentEmpresa, expiresAt: new Date('2020-01-01') }],
  now: new Date('2024-06-01T13:00:00Z'),
}).visibleAssertions; // []
```

Em ambos os casos `expiresAt` volta `null`.

### Texto legível

```ts
import { describeAssertion } from 'nd-profile-core';

describeAssertion(atencao);
// 'Cognition / attention: sustained attention and task persistence = high impact'
```

---

## 11. Conformidade, versionamento e extensão

### Conformidade

Implementações que se dizem compatíveis com `nd-profile-core` **MUST**:

- produzir `Assertion` com `branch`, `type`, `facet`, `value`, `construct`, `source`, `status` e `polarity` (quando aplicável);
- respeitar a filtragem por `Consent` e `visibility` exatamente como na Seção 10;
- tratar `expiresAt` como prazo máximo, nunca estendê-lo;
- ignorar asserções de outro `userId`.

**SHOULD**:

- usar `facetAttributesFor()` para validar entradas externas;
- documentar o mapeamento de constructos próprios para os atributos do core.

**MAY**:

- adicionar atributos livres a `facet.attribute` (via `Open<T>`);
- adicionar campos próprios sob prefixo `x-` em objetos do core.

### Versionamento

O schema segue **semver**:

- `1.x.y` → `1.x.(y+1)`: adição compatível (novo atributo, novo valor de enum opcional).
- `1.x.y` → `1.(x+1).0`: adição de campo obrigatório ou mudança de semântica — quebra.
- `2.0.0`: remoção de campo ou mudança de tipo.

Campos marcados como `deprecated` permanecem por **no mínimo duas versões menores** antes de serem removidos.

### Extensão

Para necessidades que o core não cobre, use prefixo `x-` em objetos do core ou namespace próprio fora do core. Isso evita que cada ferramenta invente sua gambiarra dentro do vocabulário comum.

---

## 12. Governança e declaração de conformidade

- **Propostas de mudança:** abra issue com a tag `proposal`, descrevendo o caso de uso e o impacto em conformidade.
- **Decisão:** mudanças que afetam conformidade exigem aprovação do mantenedor e período de comentário público de 14 dias.
- **Recusa:** propostas recusadas ficam registradas com justificativa.
- **Declaração de conformidade:** alegar compatibilidade exige passar pelas checagens MUST acima. A alegação é do implementador, e apenas dele. O mantenedor não emite selo, não inspeciona implementações e não assume responsabilidade por alegações de terceiros.

> **Alerta sobre a marca.** O nome `nd-profile-core` não é marca registrada neste repositório. Usar o nome para descrever compatibilidade é livre; usá-lo de modo que sugira endosso, certificação ou registro não é. Se você registrar a marca, defina por escrito a política de uso do nome e mantenha-a pública.

---

## 13. LGPD e proteção de dados

> **Esta seção descreve o regime aplicável a quem implementa. Nada aqui é implementado, verificado ou garantido pela biblioteca.**

### O que o core não faz por você

O core **não é controlador nem operador de dados**. Não faz I/O, não armazena, não transmite, não criptografa, não controla acesso, não registra log, não gera relatório de impacto. Ele é uma função pura de filtragem em memória. **O implementador é o controlador, e a responsabilidade pelo cumprimento da LGPD é dele.**

### Dados sensíveis de saúde

A maior parte das asserções deste schema descreve saúde. Na LGPD, dado sobre saúde é **dado pessoal sensível** (art. 5º, II, "c"), e o regime do art. 11 é mais restritivo que o do art. 7: as bases legais usuais de legítimo interesse e consentimento genérico **não são suficientes**.

O art. 11 admite consentimento **de forma específica e destacada, para finalidades específicas** (inciso I), e hipóteses independentes de consentimento (inciso II) — entre elas a proteção da saúde da própria pessoa, em especial em procedimento de assistência à saúde, e o cumprimento de obrigação legal. **Fundamente a base legal por escrito, por finalidade.**

### Consentimento: o modelo do core ajuda

O desenho de `Consent` corresponde razoavelmente aos requisitos materiais do art. 8º: finalidade específica (`targetAudience` + enumeração de `sharedAssertionIds`), destaque (o consentimento é um objeto explícito, não um flag), revogação facilitada (campo `revoked`) e prazo (`expiresAt`).

> **Ressalva para uso em contexto de trabalho.** Em relações de emprego, o consentimento é especialmente frágil: o Radar Tecnológico nº 4 da ANPD registra que ele pode se tornar inválido "por ausência de livre manifestação de vontade quando as circunstâncias indicarem a posição de desvantagem do titular, em especial quando puder sofrer consequências negativas caso não consinta com o tratamento de seus dados". Para `Company`, a base legal preferencial não é o consentimento isolado, mas a obrigação legal de adaptação razoável (LBI, art. 34, §1º) — ver a Seção 6. Ter um `Consent` bem formado **não** resolve essa questão.

O que o core **não** faz:

- **coletar** o consentimento — não há UI, nem termo, nem registro do que foi aceito;
- **comprovar a existência do consentimento** — o art. 8º, §2º incumbe o controlador de demonstrar a existência e guardar o consentimento sob sua guarda. O objeto `Consent` é a estrutura, não a prova;
- **atender revogação** — o titular pode revogar a qualquer momento, por procedimento gratuito e facilitado (art. 8º, §5º). Implementar isso é seu;
- **eliminar dados** — o art. 18º, VI dá direito à eliminação dos dados tratados com consentimento. Revogar impede novas entregas; **não apaga o que já foi persistido** (Seção 15).

### Direitos do titular

Confirme que sua implementação atende aos direitos do art. 18º: confirmação, acesso, correção, anonimização/bloqueio/eliminação, portabilidade e eliminação. O core entrega `ProfileView` e `describeAssertion()` — o que é, em boa parte, resposta de acesso; o resto é seu.

### Relatório de impacto

Operações de tratamento de dados sensíveis de saúde, especialmente quando combinam compartilhamento com terceiros, tendem a ser de **alto risco** e podem exigir **Relatório de Impacto à Proteção de Dados Pessoais** (RIPD), conforme a regulamentação da ANPD (Resolução CD/ANPD nº 23/2024, que aprova o regulamento do art. 5º, XI, e do art. 38 da LGPD). Há hipóteses de dispensa — notadamente quando o tratamento se baseia em consentimento (art. 11, I) ou em hipóteses do art. 11, II. **A avaliação de alto risco e a eventual exigência de RIPD são responsabilidade do controlador** — cabe ao implementador determinar se a sua operação se enquadra, com base nos fatos do seu tratamento, e não nesta seção.

### Crianças e adolescentes

Dados de neurodivergência de crianças e adolescentes exigem atenção redobrada: o art. 14º da LGPD manda que o tratamento considere o **melhor interesse** da criança e o consentimento específico e em destaque de um dos pais ou responsável legal. O core não tem noção de idade, de responsável legal ou de melhor interesse — `birthDate` no tipo `User` é dado de contexto, não mecanismo de verificação.

### Transferência internacional e LGPD

O core é agnóstico de jurisdição. Se o dado sair do Brasil, a ANPD pode exigir mecanismo de transferência internacional (arts. 33 a 36). Implementadores fora do Brasil devem, além disso, verificar o regime de dados sensíveis do GDPR (art. 9) e as bases legais que dele decorrem. Nada disso é tratado aqui.

---

## 14. Limites regulatórios e deontológicos

> **Esta seção delimita o que a biblioteca é. Nada aqui é implementado, verificado ou garantido por ela.**

### Dispositivo médico (ANVISA)

Esta biblioteca **não é dispositivo médico** e não tem finalidade médica. Não recebe entrada de paciente, não processa dado clínico, não emite saída diagnóstica, não calcula escore e não produz resultado interpretável como avaliação. Os rótulos `Condition` e `Diagnosis` são nomes de campo que descrevem a posição de uma afirmação no modelo.

Software com indicação médica — diagnóstico, prognóstico, monitoramento, decisão clínica — é regulado no Brasil como **software como dispositivo médico (SaMD)**, pela RDC 788/2023 e pela RDC 751/2022, com classificação de risco e registro ou notificação conforme a classe.

**Este schema não é dispositivo médico, e o core não tem finalidade médica alguma.** A separação entre "estrutura" e "produto" é o que mantém esta biblioteca fora daquele regime: quem constrói a ferramenta decide a finalidade de uso, e é quem responde pela conformidade do produto que construiu. O core não indica finalidades, não classifica risco e não emite saída diagnóstica — se um produto construído sobre ele fizer isso, o produto é que é dispositivo médico.

### Contexto clínico: quem implementa responde

O **sigilo profissional** é dever do profissional, não um atributo de dado. O `authorId` aponta para quem redactou a asserção; `source.kind: 'professional_evaluation'` indica que um profissional habilitado produziu o conteúdo. O core não verifica habilitação, não autentica autoria e não substitui a guarda de prontuário.

- **Psicologia.** O Código de Ética do Psicólogo (CFP, 2005, art. 9º) impõe o dever de sigilo profissional, com reflexos na guarda e no compartilhamento de dados psicológicos. Compartilhar dado psicológico com empregador não é ato de terceiro: é ato do profissional responsável, e ele responde por ele.
- **Medicina.** A Resolução CFM nº 2.454/2026, que normatiza o uso de IA na medicina, incide sobre **médicos e instituições médicas que usam IA em contexto assistencial** — não sobre fornecedores de software. Se um produto construído sobre este schema for usado por um médico, é o **médico** que responde perante o CFM, não o fornecedor do schema. As obrigações ali previstas (supervisão humana, vedação à delegação de comunicação de diagnósticos sem mediação humana, registro do uso no prontuário, dever de zelar pela confidencialidade dos dados de saúde) são dele. O core não é destinado a contexto assistencial.
- **Exame de saúde ocupacional.** O acesso ao prontuário de saúde ocupacional é restrito ao médico responsável (coordenador) e, sob sigilo, ao empregador. O empregador não recebe diagnóstico: recebe atestado de aptidão com restrições.

### Conformidade social e de dados

Empresas que usam este core em contexto de RH operam em ambiente de **risco de neurodiscriminação** — discrimininação decorrente de inferências feitas sobre estados mentais. O termo é cunhado na doutrina (Ienca; Ignatiadis, 2020) e aparece no **Radar Tecnológico nº 4 da ANPD** ("Neurotecnologias"), que registra: o art. 6º, IX, da LGPD proíbe o tratamento de dados neurais que constitua discriminação antijurídica; e *"no ambiente de trabalho, empregados podem ser tratados com base na inferência sobre estados mentais e emocionais"* (ICO, 2023).

O mesmo Radar é explícito sobre consentimento em contexto laboral: ele *"pode se tornar inválido por ausência de livre manifestação de vontade quando as circunstâncias indicarem a posição de desvantagem do titular, em especial quando puder sofrer consequências negativas caso não consinta com o tratamento de seus dados"*, e conclui que o uso da hipótese normativa do consentimento *"dificilmente será adequado em aplicações de neurotecnologias nos ambientes de trabalho e escolar"*.

> **Ressalva de escopo, e é importante.** O Radar trata de **neurotecnologias** — captação de sinal neural por dispositivo. O `nd-profile-core` **não é neurotecnologia**: ele não capta nada, não infere estado mental e não gera dado por dispositivo. As afirmações do Radar não são automaticamente aplicáveis a este schema. Mas o **princípio** que ele enuncia — consentimento fragilizado quando o titular está em posição de desvantagem e sofre consequências negativas por não consentir — é de aplicação geral e vale integralmente para o caso de uso `Company`, onde o titular é empregado do destinatário. É por isso que a Seção 6 recomenda fundamento legal que não dependa do consentimento isolado.

A mitigação é estrutural e está descrita na Seção 6: base legal fundamentada, acesso mínimo, vedação de uso decisório, retenção definida.

---

## 15. O que este core não garante

**Falha fechada.** Sem consentimento ativo, `Company` não recebe nada. Não há caminho lateral, valor padrão implícito, fallback ou atalho que entregue asserções sem consentimento válido.

**O core controla a entrega, não a posse.** Revogar um consentimento impede **novas** entregas via `build()`. O core **não apaga** cópias já persistidas pelo implementador — um `ProfileView` que foi salvo num banco, exportado, impresso ou sincronizado com outro sistema continua lá. Implementadores são responsáveis por definir política de retenção e eliminação após revogação, e por garantir o atendimento ao art. 18º da LGPD.

**O core não modela o ambiente de destino.** Ele entrega um `ProfileView` filtrado pelo consentimento da pessoa. Como o implementador organiza, armazena, exibe ou integra esse perfil no próprio ambiente (sistema de RH, saúde ocupacional, ferramenta interna) é decisão e responsabilidade de quem implementa. O core não define retenção, controle de acesso, finalidade de uso nem integração com outros sistemas — apenas a estrutura da asserção e a regra de filtragem por consentimento.

**O core não audita.** Ele não verifica se o dado é real ou fictício, se a base legal é adequada, se o acesso foi restringido, se o dado foi usado para demissão ou avaliação de desempenho, ou se a retenção está dentro do prazo.

**O core não autentica.** `authorId` e `professional_evaluation` são declarações do implementador. Verificar habilitação profissional, autenticar autor e garantir que a avaliação exista são tarefas dele.

**A conformidade regulatória é responsabilidade do implementador.** Este core fornece apenas uma estrutura de modelagem de dados. Implementadores que o utilizarem em cenários específicos — incluindo, mas não se limitando a, gestão de recursos humanos, saúde ocupacional e segurança do trabalho — devem **determinar por si mesmos** se estão sujeitos a requisitos regulatórios específicos (NRs, LGPD, eSocial, legislação setorial, regras internas da organização) e garantir a conformidade por conta própria. O core não fornece orientação regulatória, não verifica conformidade e não substitui aconselhamento jurídico.

**O core não garante conformidade regulatória.** Ele não implementa, não verifica e não garante observância da LGPD, da LBI, das normas de saúde ocupacional, do sigilo profissional ou de qualquer resolução de conselho profissional.

---

## 16. Integração com NestJS

```ts
import { Injectable } from '@nestjs/common';
import { ProfileService, type ProfileView } from 'nd-profile-core';

@Injectable()
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  async mine(userId: string): Promise<ProfileView> {
    const [assertions, consents] = await Promise.all([
      this.repo.findByUser(userId),
      this.consentRepo.findActive(userId),
    ]);

    return this.profile.build({
      userId,
      visibility: 'Personal',
      assertions,
      consents,
    });
  }
}
```

`ProfileService` é uma classe sem estado — pode ser provider singleton do Nest, instanciada localmente, ou chamada como função.

---

## 17. Armadilhas

1. **Sem I/O.** A biblioteca só define contratos e filtra em memória. Persistência, autenticação e regras de negócio ficam com você.

2. **Datas são `Date`, não string.** `birthDate`, `createdAt`, `expiresAt`, `source.date`. Ao serializar para JSON, elas viram ISO strings.

3. **`expiresAt: null` é ambíguo.** Significa "sem expiração" tanto quanto "sem consentimento ativo". Use `visibleAssertions.length === 0` para distinguir.

4. **A expiração mais cedo governa.** Com dois consentimentos ativos para a mesma audiência, o profile expira no menor prazo.

5. **Consentimento expirado é ignorado em silêncio** — sem erro, sem log. A lista simplesmente sai vazia. Confira as datas.

6. **A biblioteca não filtra por `status`.** `Suggestive` aparece igual a `Confirmed` — inclusive enquadramentos sugestivos. Se precisar ocultá-los, filtre antes de chamar `build()`.

7. **`Open<T>` permite atributos novos.** Você pode estender o vocabulário de facets sem alterar a biblioteca. Para dados externos, valide com `facetAttributesFor`.

8. **O `Facet` não amarra `type` a `attribute`.** `type: 'Learning'` com `attribute: 'sleep'` passa na checagem de tipos. Use `FacetAttributesOf<T>` ou `facetAttributesFor()` para amarrar.

9. **Escolha a audiência pelo princípio da necessidade.** O modelo só restringe; ele não impede que você conceda consentimento amplo demais. `Company` deveria conter o mínimo para o trabalho acontecer.

10. **O core não armazena conteúdo clínico.** `fileId` referencia documento no armazenamento de quem implementa. Endereço, telefone, medicação e laudo pertencem ao sistema de saúde — nunca ao core.

11. **Enumerar não é automatizar.** `sharedAssertionIds` é uma lista explícita. Não a preencha por regra — é a enumeração que torna a revogação auditável.

12. **Revogação não é eliminação.** `revoked: true` esvazia as próximas entregas. O que já foi persistido continua lá, e a eliminação é sua (Seção 15).

13. **Consentimento no trabalho é frágil.** Na relação de emprego, o consentimento como base legal é juridicamente frágil, por desequilíbrio de poder. Se o uso for adaptação razoável, fundamentação de obrigação legal costuma ser mais robusta (Seção 6).

---

## 18. Desenvolvimento local

```bash
pnpm install
pnpm build       # compila src/ → dist/
pnpm typecheck   # tsc --noEmit em modo estrito
```

---

## 19. Atribuição

Este modelo foi concebido e especificado pelo mantenedor, com auxílio de ferramentas de IA (DeepSeek, Claude Code, ChatGPT) na redação, revisão e estruturação. O conteúdo final é de responsabilidade do autor, e não das ferramentas de IA utilizadas. A especificação é aberta justamente para ser revisada por terceiros.

O exemplo da Seção 4 e da Seção 9 é **fictício**. Nenhum caso clínico real, nenhum instrumento de avaliação e nenhum dado pessoal identificável foram utilizados na sua construção.
