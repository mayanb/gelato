const { reloadApp } = require('detox-expo-helpers');

describe('Example', () => {
  beforeEach(async () => {
	  await reloadApp()
    await tryLogin('alabama', 'ishita', 'cupcake12')
  })

  afterEach(async () => {
    //await tryLogout()
  })

  // it('should logout and back in', async () => {
  //   await tryLogout()
  //   await tryLogin('valencia', 'wizards', 'cupcake12')
  // })

  it('should create task', async () => {
    await element(by.id('MS-create-task-button')).tap()
    await expect(element(by.id('create-task-screen'))).toBeVisible()
    await trySelectOption('CTS-process-dropdown', 'Rotary Conche Pull')
    await trySelectOption('CTS-product-dropdown', 'Piura Blanco')
    await element(by.id('CTS-confirm')).tap()
  })
})

async function tryLogin(team, username, password) {
  await waitFor(element(by.id('login-screen'))).toBeVisible().withTimeout(2000)

  await element(by.id('LS-team-input')).replaceText(team)
  await element(by.id('LS-username-input')).replaceText(username)
  await element(by.id('LS-password-input')).replaceText(password)
  await element(by.id('LS-button')).tap()

  //await expect(element(by.id('main-screen'))).toBeVisible()
}

async function tryLogout() {
  await element(by.id('MS-menu-button')).tap()
  await element(by.text('Logout')).tap()
  await expect(element(by.id('login-screen'))).toBeVisible()
}

async function trySelectOption(dropdown, option) {
  await element(by.id(dropdown)).tap()
  await expect(element(by.id(option)).atIndex(0)).toBeVisible()
  await  element(by.id(option)).atIndex(0).tap()
  await expect(element(by.id(option)).atIndex(0)).toBeNotVisible()
}