# nd-profile-core

Core de modelagem de neurodivergência para qualquer ferramenta que aceite a estrutura. Contratos de domínio (tipos, vocabulários e montagem do perfil) agnósticos de framework — NestJS, Fastify, Express, React, CLI.

Biblioteca **framework-agnostic**, **sem dependências de runtime**, **ESM-only**, Node >= 20.19.

> **Não afiliado** a "accessibility passports" governamentais ou comerciais, nem a schemas de "cognitive passport" publicados. "Profile", aqui, é o nome genérico da visão filtrada de asserções — não o produto de nenhum fornecedor.

> **Este core não é dispositivo médico.** Não diagnostica, não coleta dados, não substitui avaliação profissional. Ele apenas descreve a **estrutura** de afirmações sobre funcionamento humano. Quem implementa é responsável pelo uso.

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

## 2. Licença

- **Schema, tipos e documentação:** CC0 1.0 (domínio público). Uso livre, sem atribuição obrigatória.
- **Código de referência e validadores:** Apache-2.0.

A separação é intencional: o schema precisa ser adotável por qualquer ferramenta, inclusive comercial, sem atrito jurídico. O código de referência mantém a cláusula de patente do Apache-2.0, que dá segurança a adotantes corporativos.

Arquivos: [`LICENSE`](./LICENSE) (Apache-2.0, código) e [`LICENSE-SCHEMA.md`](./LICENSE-SCHEMA.md) (CC0 1.0, schema e documentação).

O nome `nd-profile-core` e eventuais selos de conformidade **não** são licenciados junto com o schema. Uso do nome para indicar compatibilidade segue a política da Seção 10.

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

### 5.3 `Consent`

```ts
const consentClinica: Consent = {
  id: 'cns_example_clinic',
  userId: 'usr_example',
  targetAudience: 'Clinic',
  sharedAssertionIds: [
    'asr_example_condition_attention',
    'asr_example_condition_social',
    'asr_example_attention',
    'asr_example_memory',
    'asr_example_stress',
    'asr_example_social',
    'asr_example_need_sleep',
  ],
  expiresAt: new Date('2025-06-01T23:59:59Z'),
  revoked: false,
};
```

| Campo | Como preencher |
|---|---|
| `targetAudience` | `Personal` · `Clinic` · `Company` |
| `sharedAssertionIds` | IDs das asserções que essa audiência pode ver — **enumere, não automatize** |
| `expiresAt` | Data no futuro. Passada, o consentimento é ignorado em silêncio |
| `revoked` | `true` revoga imediatamente |

Um consentimento mais restrito, para a empresa:

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

---

## 6. `branch` × `type`: qual escolher

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

## 7. Facets: atributos conhecidos e livres

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

---

## 8. Conjunto completo de asserções do exemplo sintético

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

## 9. A saída

`ProfileService.build()` filtra as asserções conforme a audiência e os consentimentos ativos e devolve a visão.

```ts
import { ProfileService } from 'nd-profile-core';

const profile = new ProfileService().build({
  userId: 'usr_example',
  visibility: 'Clinic',
  assertions,
  consents: [consentClinica],
  now: new Date('2024-06-01T13:00:00Z'),
});
```

### Regras

| `visibility` | O que aparece |
|---|---|
| `Personal` | Todas as asserções da própria pessoa. `expiresAt` é sempre `null` |
| `Clinic` / `Company` | Apenas as asserções listadas em consentimentos **ativos** para essa audiência |

Consentimento ativo = mesmo `userId`, mesmo `targetAudience`, `revoked: false` e `expiresAt` no futuro.

`expiresAt` do profile = a **menor** expiração entre os consentimentos ativos. Asserções de outro `userId` são sempre ignoradas.

### O que volta

```ts
{
  userId: 'usr_example',
  visibility: 'Clinic',
  visibleAssertions: [ /* AssertionView[] */ ],
  generatedAt: new Date('2024-06-01T13:00:00Z'),
  expiresAt: new Date('2025-06-01T23:59:59Z'),
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

### Saída da audiência clínica

```ts
const profile = new ProfileService().build({
  userId: 'usr_example',
  visibility: 'Clinic',
  assertions,
  consents: [consentClinica],
  now: new Date('2024-06-01T13:00:00Z'),
});

console.log(profile.visibleAssertions.map((a) => a.description));
```

```
'Cognition / attention: condition framing = attention-related condition (suggestive framing)'
'Social / social_interaction: social framing = social reciprocity condition (suggestive framing)'
'Cognition / attention: sustained attention and task persistence = high impact'
'Cognition / memory: verbal learning and memory = moderate impact'
'Regulation / stress: anxiety-related symptoms = mild impact'
'Social / social_interaction: social reciprocity = consistent support needed'
'Regulation / sleep: sleep hygiene = earlier sleep and reduced screen exposure before bed'
```

```
profile.expiresAt  // 2025-06-01T23:59:59.000Z
```

### Saída da audiência empresa

```ts
const profile = new ProfileService().build({
  userId: 'usr_example',
  visibility: 'Company',
  assertions,
  consents: [consentEmpresa],
  now: new Date('2024-06-01T13:00:00Z'),
});

console.log(profile.visibleAssertions.map((a) => a.construct));
```

```
'sustained attention and task persistence'
'task organization'
```

Nada de diagnóstico, nada de enquadramento social — apenas o mínimo para o trabalho acontecer.

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
  userId: 'usr_example', visibility: 'Clinic', assertions,
  consents: [{ ...consentClinica, revoked: true }],
  now: new Date('2024-06-01T13:00:00Z'),
}).visibleAssertions; // []

// expirado
new ProfileService().build({
  userId: 'usr_example', visibility: 'Clinic', assertions,
  consents: [{ ...consentClinica, expiresAt: new Date('2020-01-01') }],
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

## 10. Conformidade, versionamento e extensão

### Conformidade

Implementações que se dizem compatíveis com `nd-profile-core` **MUST**:

- produzir `Assertion` com `branch`, `type`, `facet`, `value`, `construct`, `source`, `status` e `polarity` (quando aplicável);
- respeitar a filtragem por `Consent` e `visibility` exatamente como na Seção 9;
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

## 11. Governança

- **Propostas de mudança:** abra issue com a tag `proposal`, descrevendo o caso de uso e o impacto em conformidade.
- **Decisão:** mudanças que afetam conformidade exigem aprovação do mantenedor e período de comentário público de 14 dias.
- **Recusa:** propostas recusadas ficam registradas com justificativa.
- **Selo de conformidade:** uso do nome `nd-profile-core` para indicar compatibilidade exige passar pelas checagens MUST acima. O selo é operado pelo mantenedor; o schema, não.

---

## 12. Integração com NestJS

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

## 13. Armadilhas

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

---

## 14. Desenvolvimento local

```bash
pnpm install
pnpm build       # compila src/ → dist/
pnpm typecheck   # tsc --noEmit em modo estrito
```

---

## 15. Atribuição

Este modelo foi concebido e especificado pelo mantenedor, com auxílio de ferramentas de IA (DeepSeek, Claude Code, ChatGPT) na redação, revisão e estruturação. O conteúdo final é de responsabilidade do autor. A especificação é aberta justamente para ser revisada por terceiros.

O exemplo da Seção 4 e da Seção 8 é **fictício**. Nenhum caso clínico real, nenhum instrumento de avaliação e nenhum dado pessoal identificável foram utilizados na sua construção.
