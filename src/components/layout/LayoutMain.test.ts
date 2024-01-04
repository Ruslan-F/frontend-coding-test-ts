/* eslint-disable import/no-extraneous-dependencies */
import { fireEvent, render } from '@testing-library/vue'
import LayoutMain from './LayoutMain.vue'

test('has clickable navigation', async () => {
  const { getByText, getByTestId } = render(LayoutMain)

  getByText('Home')
  getByText('Result')

  const homeLink = getByTestId('link-home')
  const resultLink = getByTestId('link-result')

  await fireEvent.click(homeLink)
  await fireEvent.click(resultLink)
})
