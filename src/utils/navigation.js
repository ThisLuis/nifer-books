const checkIsNavigationSupported = () => {
	return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
	// cargamos la pagina de destino con un fetc
	const response = await fetch(url)
	const text = await response.text()
	// nos quedamos con el contenido del html de la pagina que solicitamos, lo extraemos con una regex
	const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
	return data
}
export const startViewTransition = () => {
	if (!checkIsNavigationSupported()) return
	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)

		// Pagina externa? No hacemos nada
		if (location.origin !== toUrl.origin) return

		event.intercept({
			async handler () {
				const data = await fetchPage(toUrl.pathname)
				// utilizamos la api de View Transition API
				document.startViewTransition(() => {
					document.body.innerHTML = data
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}