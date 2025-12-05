export function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString()
        })



        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {})
            } catch (e) {

                resolve({})
            }
        })

        req.on('error', reject)
    })
}

export function getTokenFromHeader(req) {
    const auth = req.headers.authorization;

    if (auth && auth.startsWith('Bearer')){
      
        return auth.substring(7)
    }

    return null
}

export function sendJSON(res, statusCode, data){
    res.writeHead(statusCode, { 
    'Content-Type': 'application/json' 
  });
  res.end(JSON.stringify(data));
}

/**
 * Configura cabeçalhos CORS
 * CORS = Cross-Origin Resource Sharing
 * Permite que o frontend acesse a API de outro domínio
 */
export function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

