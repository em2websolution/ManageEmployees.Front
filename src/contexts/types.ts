export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  userName: string
  password: string
  rememberMe?: boolean
}

interface UserFromApi {
  userName?: string
  roleName?: string
  phoneNumber?: string
}

export interface UserDataType extends UserFromApi {
  id?: number
  role?: string
  email?: string
  fullName?: string
  username?: string
  password?: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

export type Verniz = {
  frente?: Array<{
    id: number
    nome: string
  }>
  verso?: Array<{
    id: number
    nome: string
  }>
}

//** Existe - TIPO C
export type ComponenteCatalogoTypes = {
  nomeComponente: string
  tipoPapel: string
  gramatura: string
  cores: {
    frente: string
    verso: string
  }
  formatoPagina: {
    largura: string
    altura: string
  }
  regraMontagem: string
  verniz?: Verniz

  paginas: number | string
  tipo?: string
  opcionais?: OpcionalTypes | any
}

// ** existe - TIPO X
export type ComponenteCartuchoTypes = {
  nomeComponente: string
  tipoPapel: string
  gramatura: string
  cores: {
    frente: string
    verso: string
  }

  verniz?: Verniz

  formatoAberto: {
    largura: string
    altura: string
  }
  formatoFechado: {
    largura: string
    altura: string
  }

  tipoCartucho: string
  colagem: string

  detalhesCartucho?: {
    tipoCartucho?: string
    colagemCartucho?: string
    descLat?: string
    tampasSuperioresPosition?: string
    tampasInferioresPosition?: string
    abaColaPosition?: string
    abaLateral?: string
    frente?: string
    lateral?: string
    altura?: string
    tampasSuperiores?: string
    travasInternasSuperiores?: string
    abaDeCola?: string
    abasInternasSuperiores?: string
  }
  tipo?: string
  opcionais?: OpcionalTypes | any
}

// ** existe - TIPO F
export type ComponenteFolhasTypes = {
  nomeComponente: string
  tipo: string
  tipoPapel: string
  gramatura: string
  cores: {
    frente: string
    verso: string
  }

  verniz?: Verniz
  formatoAberto: {
    altura: string
    largura: string
  }
  formatoFechado: {
    altura: string
    largura: string
  }
  opcionais?: OpcionalTypes | any
}

export interface UploadedFile {
  nomeImagem: string
  url: string
}

export interface OpcionalTypes {
  id: number
  nome: string
  imagens?: UploadedFile[]
}

export type OrcamentoDataType = {
  fluxoOrcamento: string
  produto: Array<{
    idProduto: string
    nomeProduto: string
    tipo?: string
    opcionais?: OpcionalTypes | any
  }>

  favorecido: Array<{
    idFavorecido?: string
    nomeFavorecido?: string
  }>
  vendedor: string | null | undefined
  comprador: string
  titulo: string
  condPagamento: string | null
  dataEntrega: string | null
  componente?: Array<
    | ComponenteCatalogoTypes
    | ComponenteCartuchoTypes
    | ComponenteFolhasTypes
    | null
    | string
    | any
    | undefined
  >
  quantidade: Array<{
    quantidade?: string
    modelo?: string
  }>
  versao: string
  observacoes: string
  dadosConfirmados: boolean
  codigoMaterialErp?: string
  codigoTipoEstoqueErp?: string
}

export type OrcamentoContextType = {
  orcamento: OrcamentoDataType | any
  setOrcamento: (value: OrcamentoDataType | null | any) => void
  limparContextoOrcamento: () => void
}

export type AtributosOrcamentoTypes = {
  componente: Array<ComponenteCatalogoTypes | ComponenteCartuchoTypes | null | any>
  codPagamento: string
  quantidades: Array<{
    quantidade: string
    modelo: string
  }>
  observacao: string
  comprador: string
  fluxoOrcamento: string
}

export type SolicitacaoOrcamentoType = {
  titulo: string
  id: string | undefined
  atributos: string
  favorecidoId: string
  favorecidoNome: string
  tiposProdutoId: string
  produtoNome: string
  dataEntrega: string
}
