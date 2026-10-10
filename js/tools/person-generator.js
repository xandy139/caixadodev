/**
 * Ferramenta: Gerador de Pessoas e Massa de Dados Fictícios
 * Gera dados completos brasileiros para testes de software e homologação
 */

const PERSON_GENERATOR = {
  firstNamesMasc: [
    'Lucas', 'Gabriel', 'Mateus', 'Guilherme', 'Felipe', 'Rafael', 'Rodrigo', 'Thiago',
    'Bruno', 'Leonardo', 'Gustavo', 'Eduardo', 'André', 'Caio', 'Daniel', 'Henrique',
    'Bernardo', 'Murilo', 'Vinicius', 'Enzo', 'Lorenzo', 'Arthur', 'Heitor', 'Davi'
  ],

  firstNamesFem: [
    'Mariana', 'Beatriz', 'Camila', 'Larissa', 'Juliana', 'Fernanda', 'Amanda', 'Bruna',
    'Letícia', 'Carolina', 'Isabela', 'Gabriela', 'Natália', 'Jéssica', 'Vanessa', 'Rafaela',
    'Helena', 'Alice', 'Sophia', 'Manuela', 'Valentina', 'Lívia', 'Lorena', 'Giovanna'
  ],

  lastNames: [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
    'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
    'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
    'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos'
  ],

  streets: [
    'Rua das Flores', 'Avenida Paulista', 'Rua XV de Novembro', 'Avenida Brasil',
    'Rua São João', 'Avenida Independência', 'Rua Tiradentes', 'Rua Bela Vista',
    'Avenida Rio Branco', 'Rua Sete de Setembro', 'Rua Marechal Deodoro', 'Avenida Central',
    'Rua das Palmeiras', 'Rua Santos Dumont', 'Avenida Getúlio Vargas', 'Rua Primavera'
  ],

  neighborhoods: [
    'Centro', 'Jardins', 'Bela Vista', 'Copacabana', 'Moema', 'Boa Viagem', 'Savassi',
    'Vila Mariana', 'Pinheiros', 'Barra da Tijuca', 'Moinhos de Vento', 'Meireles',
    'Asa Sul', 'Asa Norte', 'Batel', 'Ponta Verde', 'Graça', 'Cambuí'
  ],

  statesData: {
    'SP': { name: 'São Paulo', cities: ['São Paulo', 'Campinas', 'Santos', 'São Bernardo do Campo', 'Ribeirão Preto', 'Sorocaba'], ddd: '11', cepPrefix: '010' },
    'RJ': { name: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Duque de Caxias', 'Cabo Frio'], ddd: '21', cepPrefix: '200' },
    'MG': { name: 'Minas Gerais', cities: ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Betim', 'Montes Claros'], ddd: '31', cepPrefix: '301' },
    'RS': { name: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'], ddd: '51', cepPrefix: '900' },
    'PR': { name: 'Paraná', cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'], ddd: '41', cepPrefix: '800' },
    'SC': { name: 'Santa Catarina', cities: ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Itajaí'], ddd: '48', cepPrefix: '880' },
    'BA': { name: 'Bahia', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Ilhéus'], ddd: '71', cepPrefix: '400' },
    'PE': { name: 'Pernambuco', cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'], ddd: '81', cepPrefix: '500' },
    'CE': { name: 'Ceará', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'], ddd: '85', cepPrefix: '600' },
    'DF': { name: 'Distrito Federal', cities: ['Brasília', 'Taguatinga', 'Ceilândia', 'Águas Claras'], ddd: '61', cepPrefix: '700' }
  },

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  generatePerson(options = { gender: 'all', state: 'SP', format: true }) {
    // 1. Sexo e Nome
    let gender = options.gender;
    if (gender === 'all' || !gender) {
      gender = Math.random() > 0.5 ? 'M' : 'F';
    }

    const firstName = gender === 'M' 
      ? this.getRandomItem(this.firstNamesMasc) 
      : this.getRandomItem(this.firstNamesFem);

    const lastName1 = this.getRandomItem(this.lastNames);
    let lastName2 = this.getRandomItem(this.lastNames);
    while (lastName2 === lastName1) {
      lastName2 = this.getRandomItem(this.lastNames);
    }

    const fullName = `${firstName} ${lastName1} ${lastName2}`;

    // 2. Idade e Data de Nascimento
    const age = this.getRandomInt(18, 75);
    const birthYear = new Date().getFullYear() - age;
    const birthMonth = String(this.getRandomInt(1, 12)).padStart(2, '0');
    const birthDay = String(this.getRandomInt(1, 28)).padStart(2, '0');
    const birthDate = `${birthDay}/${birthMonth}/${birthYear}`;

    // 3. Documentos
    const cpf = window.CPF_CNPJ_TOOL ? window.CPF_CNPJ_TOOL.generateCPF(options.format) : '111.444.777-35';
    const rgNum = String(this.getRandomInt(10000000, 99999999));
    const rgDigit = this.getRandomInt(0, 9);
    const rg = options.format 
      ? `${rgNum.slice(0, 2)}.${rgNum.slice(2, 5)}.${rgNum.slice(5, 8)}-${rgDigit}` 
      : `${rgNum}${rgDigit}`;

    // 4. Localização (Estado, Cidade, Endereço, CEP)
    const ufKeys = Object.keys(this.statesData);
    const selectedUf = (options.state && this.statesData[options.state]) 
      ? options.state 
      : this.getRandomItem(ufKeys);
    
    const stateInfo = this.statesData[selectedUf];
    const city = this.getRandomItem(stateInfo.cities);
    const street = this.getRandomItem(this.streets);
    const number = this.getRandomInt(10, 2450);
    const neighborhood = this.getRandomItem(this.neighborhoods);
    const cepSuffix = String(this.getRandomInt(10, 990)).padStart(3, '0');
    const cep = options.format ? `${stateInfo.cepPrefix}00-${cepSuffix}` : `${stateInfo.cepPrefix}00${cepSuffix}`;

    // 5. Contato
    const cleanFirstName = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanLastName = lastName2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const emailDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com.br', 'empresa.com.br'];
    const email = `${cleanFirstName}.${cleanLastName}${this.getRandomInt(10, 99)}@${this.getRandomItem(emailDomains)}`;

    const phoneNum = String(this.getRandomInt(900000000, 999999999));
    const phone = options.format 
      ? `(${stateInfo.ddd}) ${phoneNum.slice(0, 5)}-${phoneNum.slice(5)}` 
      : `${stateInfo.ddd}${phoneNum}`;

    // 6. Dados Complementares
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const blood = this.getRandomItem(bloodTypes);
    const height = (this.getRandomInt(155, 192) / 100).toFixed(2);
    const weight = this.getRandomInt(52, 98);

    return {
      name: fullName,
      gender: gender === 'M' ? 'Masculino' : 'Feminino',
      age: `${age} anos`,
      birthDate,
      cpf,
      rg,
      email,
      phone,
      cep,
      street: `${street}, ${number}`,
      neighborhood,
      city,
      state: `${stateInfo.name} (${selectedUf})`,
      blood,
      height: `${height} m`,
      weight: `${weight} kg`
    };
  }
};

window.PERSON_GENERATOR = PERSON_GENERATOR;
