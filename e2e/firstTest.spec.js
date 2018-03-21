const { reloadApp } = require('detox-expo-helpers');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Example', () => {
  beforeEach(async () => {
	  await reloadApp()
  })

  // it('should logout and back in', async () => {
  //   await tryLogin()
  //   await tryLogout()
  //   await tryLogin('valencia', 'wizards', 'cupcake12')
  // })

  // it('should create task', async () => {
  //   await tryLogin('alabama', 'ishita', 'cupcake12')
  //   await element(by.id('MS-create-task-button')).tap()
  //   await expect(element(by.id('create-task-screen'))).toBeVisible()
  //   await trySelectOption('CTS-process-dropdown', 'Rotary Conche Pull')
  //   await trySelectOption('CTS-product-dropdown', 'Piura Blanco')
  //   await element(by.id('CTS-confirm')).tap()
  // })

  it('should move inventory', async () => {
    await tryLogin('alabama', 'ishita', 'cupcake12')
    await element(by.id('MS-menu-button')).tap()
    await element(by.text('Move Items')).tap()
    await waitFor(element(by.id('move-items-screen'))).toBeVisible().withTimeout(1000)

    // wait for the modal to finish sliding up
    await sleep(1000)

    // scan and cancel an invalid QR
    await element(by.id('MIS-invalid-scan-button')).atIndex(0).tap()
    await waitFor(element(by.id('MIS-invalid-scan-modal'))).toBeVisible().withTimeout(1000)
    await element(by.id('QRD-cancel-button')).atIndex(0).tap()

    // scan and add a valid QR
    await element(by.id('MIS-valid-scan-button')).atIndex(0).tap()
    await waitFor(element(by.id('MIS-valid-scan-modal'))).toBeVisible().withTimeout(1000)
    await element(by.id('QRD-add-button')).atIndex(0).tap()

    // check that the modal opens up
    await element(by.id('MIS-list-button-count=1')).tap()
    await expect(element(by.id('MIS-list-modal'))).toBeVisible()
    await element(by.id('MIS-list-button-count=1')).tap()

    // submit and go to the next screen
    await element(by.id('MIS-confirm')).tap()
    await expect(element(by.id('confirm-move-screen'))).toBeVisible()
  })
})

async function tryLogin(team, username, password) {
  await waitFor(element(by.id('login-screen'))).toBeVisible().withTimeout(10000)

  await element(by.id('LS-team-input')).replaceText(team)
  await element(by.id('LS-username-input')).replaceText(username)
  await element(by.id('LS-password-input')).replaceText(password)
  await element(by.id('LS-button')).tap()

  await expect(element(by.id('main-screen'))).toBeVisible()
}

async function tryLogout() {
  await element(by.id('MS-menu-button')).tap()
  await element(by.text('Logout')).tap()
  await expect(element(by.id('login-screen'))).toBeVisible()
}

async function trySelectOption(dropdown, option) {
  await element(by.id(dropdown)).tap()
  await expect(element(by.id(option)).atIndex(0)).toBeVisible()
  await element(by.id(option)).atIndex(0).tap()
  await waitFor(element(by.id(option)).atIndex(0)).toBeNotVisible().withTimeout(1000)
}