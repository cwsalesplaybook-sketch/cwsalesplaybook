/** "Quem é quem" — time comercial organizado por hierarquia. */
import type { Pessoa } from '@/types';

export const TIME: Pessoa[] = [

  // ── SÓCIO FUNDADOR ──────────────────────────────────────────────
  { id: 'glauton',    nome: 'Glauton Santos',                      cargo: 'Sócio Fundador',                      slack: '@glauton'   },

  // ── COORDENAÇÃO ─────────────────────────────────────────────────
  { id: 'ana-clara-lobo',  nome: 'Ana Clara Lobo',                 cargo: 'Coordenadora Comercial',              slack: '@anaclara',  foto: '/team/ana-clara.jpeg',     email: 'ana.clara@cardapioweb.com'        },
  { id: 'vanessa',         nome: 'Vanessa Alencar',                cargo: 'Coordenadora de Parcerias',           slack: '@vanessa'                                                                    },

  // ── LIDERANÇA (continuação) ─────────────────────────────────────
  { id: 'beatriz',         nome: 'Beatriz Magalhães',              cargo: 'Liderança de Parcerias',              slack: '@beatriz'                                                                    },
  { id: 'hyorranes',       nome: 'Hyorranes',                      cargo: 'Liderança de Representantes',         slack: '@hyorranes', foto: '/team/hyorranes.jpeg',    email: 'hyorranes.souza@cardapioweb.com'  },

  // ── LIDERANÇA ───────────────────────────────────────────────────
  { id: 'joelma',          nome: 'Joelma Vieira',                  cargo: 'Liderança de Pré-Vendas (SDR)',       slack: '@joelma',    foto: '/team/joelma.jpeg'                                       },
  { id: 'pedro',           nome: 'Pedro Ferreira',                 cargo: 'Liderança de Pré-Vendas',             slack: '@pedro',     foto: '/team/pedro-ferreira.jpeg', email: 'pedro.ferreira@cardapioweb.com'  },
  { id: 'anderson',        nome: 'Antonio Anderson Castro da Silva', cargo: 'Liderança de Pré-Vendas',           slack: '@anderson',                                    email: 'antonio.anderson@cardapioweb.com' },
  { id: 'whenna',          nome: 'Whenna Oliveira',                cargo: 'Liderança de Closer',                 slack: '@whenna',    foto: '/team/whenna.jpeg',         email: 'whenna.oliveira@cardapioweb.com' },

  // ── ANALISTAS / ASSESSORES ──────────────────────────────────────
  { id: 'gerardo',         nome: 'Gerardo Magalhães',              cargo: 'Analista de RevOps',                  slack: '@gerardo'   },
  { id: 'antonio-carlos',  nome: 'Antonio Carlos',                 cargo: 'Assessor de Growth Jr II',            slack: '@antoniocarlos' },

  // ── CLOSERS ─────────────────────────────────────────────────────
  { id: 'joao',            nome: 'João Paulo',                     cargo: 'Closer',                              slack: '@joao'      },
  { id: 'gregory',         nome: 'Gregory Lavor',                  cargo: 'Closer',                              slack: '@gregory'   },
  { id: 'gustavo',         nome: 'Gustavo Duarte Pinheiro Silva',  cargo: 'Closer',                              slack: '@gustavo'   },
  { id: 'luan',            nome: 'Luan Nicolas',                   cargo: 'Closer JR III',                       slack: '@luan',      foto: '/team/luan-nicolas.jpeg' },
  { id: 'guilherme',       nome: 'Guilherme da Silva Gomes',       cargo: 'Closer Jr',                           slack: '@guilherme' },
  { id: 'leandro',         nome: 'Leandro dos Santos',             cargo: 'Closer',                              slack: '@leandro'   },
  { id: 'cleber',          nome: 'Cleber Rodrigues',               cargo: 'Closer JR I',                         slack: '@cleber'    },
  { id: 'leticia',         nome: 'Letícia Wendy da Silva Alves',   cargo: 'Closer JR I',                         slack: '@leticia'   },
  { id: 'ranier',          nome: 'Ranier Oliveira',                cargo: 'Closer JR I',                         slack: '@ranier'    },
  { id: 'rebeca',          nome: 'Rebeca Cabral',                  cargo: 'Closer JR I',                         slack: '@rebeca'    },

  // ── SDRs ────────────────────────────────────────────────────────
  { id: 'gabrielly',       nome: 'Gabrielly de Oliveira Medeiros', cargo: 'SDR II',                              slack: '@gabrielly', foto: '/team/gabrielly.jpeg' },
  { id: 'jonas',           nome: 'Jonas Nicolas Lopez Sobreira',   cargo: 'SDR II',                              slack: '@jonas'     },
  { id: 'enizia',          nome: 'Enízia M. Evangelista',          cargo: 'SDR II',                              slack: '@enizia'    },
  { id: 'tatyanna',        nome: 'Tatyanna Freitas',               cargo: 'SDR JR III',                          slack: '@tatyanna'  },
  { id: 'ryan',            nome: 'Ryan Felipe Ferreira Vieira',    cargo: 'SDR JR II',                           slack: '@ryan'      },
  { id: 'raissa',          nome: 'Raissa Fonseca',                 cargo: 'SDR JR II',                           slack: '@raissa'    },
  { id: 'luis',            nome: 'Luis Lincon Barroso Oliveira',   cargo: 'SDR JR II',                           slack: '@luis'      },
  { id: 'lara',            nome: 'Lara Stefanny Barbosa',          cargo: 'SDR JR II',                           slack: '@lara'      },
  { id: 'jose-guilherme',  nome: 'José Guilherme da Silva Galdino Feitosa', cargo: 'SDR JR II',                  slack: '@joseguilherme' },
  { id: 'marcos',          nome: 'Marcos Teles',                   cargo: 'SDR JR II',                           slack: '@marcos'    },
  { id: 'thais',           nome: 'Thais Giurizatto',               cargo: 'SDR JR I',                            slack: '@thais'     },
  { id: 'miguel',          nome: 'Miguel Carneiro Nunes',          cargo: 'SDR JR I',                            slack: '@miguel'    },
  { id: 'caique',          nome: 'Caique de Jesus Silva',          cargo: 'SDR JR I',                            slack: '@caique'    },
  { id: 'raquel',          nome: 'Raquel Alves',                   cargo: 'SDR JR I',                            slack: '@raquel'    },
  { id: 'ana-alice',       nome: 'Ana Alice Sousa do Amaral',      cargo: 'SDR JR I',                            slack: '@anaalice'  },
  { id: 'ana-clara-rodrigues', nome: 'Ana Clara Rodrigues',        cargo: 'SDR JR',                              slack: '@anaclararodrigues' },
  { id: 'dayana',          nome: 'Dayana',                         cargo: 'SDR JR',                              slack: '@dayana'    },
  { id: 'kailane',         nome: 'Ana Kailane Galdino de Carvalho', cargo: 'SDR',                                slack: '@kailane'   },
  { id: 'gabriel',         nome: 'Gabriel Alves',                  cargo: 'SDR',                                 slack: '@gabriel'   },
  { id: 'maria-gabriele',  nome: 'Maria Gabriele',                 cargo: 'SDR',                                 slack: '@mariagabriele' },
  { id: 'karol',           nome: 'Karol Santos',                   cargo: 'SDR',                                 slack: '@karol'     },
  { id: 'fabiola',         nome: 'Fabíola Emanuela Cândido Azevedo', cargo: 'SDR',                               slack: '@fabiola'   },
  { id: 'felipe',          nome: 'Felipe Queiroz',                 cargo: 'SDR',                                 slack: '@felipe'    },
];
