const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Vérifier que l'en-tête Authorization existe
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Token manquant !' });
        }

        // Extraire le token
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Format du token invalide.' });
        }

        // Vérifier le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        req.auth = { userId: decodedToken.userId };
        next(); // Passer au middleware suivant
    } catch (error) {
        // Gestion des erreurs JWT plus précise
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Le token a expiré.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide.' });
        } else {
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
    }
};
