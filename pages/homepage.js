import { bookingData } from '../data/booking-data.js'

export class Homepage {
  constructor(page) {
    this.page = page
    this.nameField = page.locator('[data-testid="ContactName"]')
    this.emailField = page.locator('[data-testid="ContactEmail"]')
    this.phoneField = page.locator('[data-testid="ContactPhone"]');
    this.subjectField = page.locator('[data-testid="ContactSubject"]');
    this.descField = page.locator('[data-testid="ContactDescription"]');
    this.submitButton = page.locator('#submitContact');
    this.verificationMessage = page.locator('.row.contact h2')
  }

  async goto() {
    await this.page.goto('https://automationintesting.online/', { waitUntil: 'networkidle' })
  }

  async submitForm() {
    const { name, email, phone, subject, description } = bookingData

    this.nameField.type(name)
    this.emailField.type(email)
    this.phoneField.type(phone)
    this.subjectField.type(subject)
    this.descField.type(description)
    await this.submitButton.click()
  }

  getVerificationMessage() {
    return this.verificationMessage.innerText()
  }
}