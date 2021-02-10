const Translator = require('.');
describe('Translator class', () => {
  it('should hold all keys for every country', () => {
    const translator = new Translator();
    const inputEnUs = {
      active: 'Active',
      menus: {
        globalDomains: 'Global Domains',
        orders: {
          title: 'Orders', submenus: {
            parameters: 'Parameters', limits: 'Limits'
          }
        }
      }
    };
    const inputPtBr = {
      active: 'Ativo',
      menus: {
        globalDomains: 'Domínios Globais',
        orders: {
          title: 'Pedidos', submenus: {
            parameters: 'Parâmetros', limits: 'Limites'
          }
        }
      }
    };
    const enUsLanguage = 'en-US';
    const ptBrLanguage = 'pt-BR';
    translator.pushKeys(enUsLanguage, inputEnUs, []);
    translator.pushKeys(ptBrLanguage, inputPtBr, []);
    const output = translator.output();
    expect(output['active']).toHaveProperty(enUsLanguage, inputEnUs.active);
    expect(output['menus.globalDomains']).toHaveProperty(enUsLanguage, inputEnUs.menus.globalDomains);
    expect(output['menus.orders.submenus.limits']).toHaveProperty(enUsLanguage, inputEnUs.menus.orders.submenus.limits);
    expect(output['menus.orders.submenus.parameters']).toHaveProperty(enUsLanguage, inputEnUs.menus.orders.submenus.parameters);
    expect(output['menus.orders.title']).toHaveProperty(enUsLanguage, inputEnUs.menus.orders.title);

    expect(output['active']).toHaveProperty(ptBrLanguage, inputPtBr.active);
    expect(output['menus.globalDomains']).toHaveProperty(ptBrLanguage, inputPtBr.menus.globalDomains);
    expect(output['menus.orders.submenus.limits']).toHaveProperty(ptBrLanguage, inputPtBr.menus.orders.submenus.limits);
    expect(output['menus.orders.submenus.parameters']).toHaveProperty(ptBrLanguage, inputPtBr.menus.orders.submenus.parameters);
    expect(output['menus.orders.title']).toHaveProperty(ptBrLanguage, inputPtBr.menus.orders.title);
  });

});
