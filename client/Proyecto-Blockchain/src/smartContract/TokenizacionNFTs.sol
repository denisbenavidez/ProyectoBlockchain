// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Importando las bibliotecas necesarias de OpenZeppelin.
import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.5.0/access/Ownable.sol";

// Definiendo el contrato "ProductNFT".
contract ProductNFT is ERC721, Ownable {
    // Variable para llevar la cuenta de los tokenIds.
    uint256 private _tokenIdCounter;

    // Mapeos para asociar productIds y tokenIds, precios con tokenIds y URLs de imágenes con tokenIds.
    mapping(uint256 => uint256) public productIdToTokenId;
    mapping(uint256 => uint256) public tokenIdToProductId;
    mapping(uint256 => uint256) public tokenIdToPrice;
    mapping(uint256 => string) public tokenIdToImageUrl; // Nuevo mapeo para URLs de imágenes.

    // Evento que se emitirá cuando un producto sea tokenizado.
    event ProductTokenized(
        uint256 productId,
        uint256 tokenId,
        address owner,
        uint256 price
    );
    // Evento para cuando el precio de un NFT cambie.
    event PriceChanged(uint256 tokenId, uint256 newPrice);
    // Evento para cuando un NFT es comprado.
    event NFTPurchased(uint256 tokenId, address buyer, uint256 price);

    // Constructor para inicializar el contrato ERC721.
    constructor() ERC721("ProductNFT", "PNFT") {}

    // Estructura para almacenar la información del producto tokenizado.
    struct TokenizedProduct {
        uint256 tokenId;
        uint256 price;
        string imageUrl;
        bool isActive; // Estado del token (activo/inactivo).
    }

    // Mapeo para asociar un tokenId con su respectiva información.
    mapping(uint256 => TokenizedProduct) public tokenizedProducts;

    // -----------------Funciones sobrescritas------------------

    // Mapeo de propietario a sus tokens
    // Este mapeo se utiliza para mantener un registro de todos los tokens que posee un propietario.
    // Aunque OpenZeppelin proporciona una extensión llamada "Enumerable" que ofrece funcionalidad similar,
    // hemos decidido implementar nuestra propia lógica por las siguientes razones:
    // 1. Menor consumo de gas: Al manejar la lógica internamente, podemos optimizar y reducir el consumo de gas.
    // 2. Mayor control sobre la funcionalidad: Esto nos permite adaptar o expandir la funcionalidad en el futuro si es necesario.
    // 3. No fue posible implementar la extensión "Enumerable" de OpenZeppelin, todo el código actual entraba en conflicto al intentar hacerlo.
    mapping(address => uint256[]) private _ownedTokens;

    // Esta función devuelve una lista de tokenIds que pertenecen a un propietario específico.
    function tokensOfOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        return _ownedTokens[owner];
    }

    // Sobrescribe la función _transfer para actualizar el mapeo _ownedTokens
    // La razón principal para sobrescribir esta función es asegurarnos de que el mapeo _ownedTokens
    // se actualice correctamente cada vez que se transfiera un token.
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._transfer(from, to, tokenId);

        // Elimina el tokenId de la lista del remitente
        // Esto es necesario para asegurarnos de que el remitente ya no posea el token después de la transferencia.
        uint256[] storage fromTokens = _ownedTokens[from];
        for (uint256 i = 0; i < fromTokens.length; i++) {
            if (fromTokens[i] == tokenId) {
                fromTokens[i] = fromTokens[fromTokens.length - 1];
                fromTokens.pop();
                break;
            }
        }

        // Agrega el tokenId a la lista del destinatario
        // Esto asegura que el destinatario tenga el token en su lista después de la transferencia.
        _ownedTokens[to].push(tokenId);
    }

    // Sobrescribe la función _mint para actualizar el mapeo _ownedTokens
    // Al igual que con _transfer, necesitamos asegurarnos de que _ownedTokens se actualice correctamente
    // cada vez que se acuñe un nuevo token.
    function _mint(address to, uint256 tokenId) internal override {
        super._mint(to, tokenId);
        _ownedTokens[to].push(tokenId);
    }

    // ---------------------------------------------------------

    // Función para tokenizar un producto y establecer un precio y una URL de imagen.
    // Objetivo: Tokeniza un producto, creando un NFT asociado a él.

    // Parámetros:
    // productId: Identificador único del producto a tokenizar.
    // price: Precio del NFT en wei.
    // imageUrl: URL de la imagen representativa del producto.
    // Retorno: Retorna el tokenId del NFT creado.

    // Flujo:
    // Incrementa _tokenIdCounter para generar un nuevo tokenId.
    // Asocia el productId con el nuevo tokenId y viceversa.
    // Asocia el tokenId con el price e imageUrl proporcionados.
    // Acuña el NFT y lo asigna al llamante de la función.
    // Emite el evento ProductTokenized.
    function tokenizeProduct(
        uint256 productId,
        uint256 price,
        string memory imageUrl
    ) external returns (uint256) {
        // Incrementando el contador de tokenId de manera más directa.
        uint256 newTokenId = ++_tokenIdCounter;

        // Asociando productId, tokenId, precio y URL de la imagen.
        productIdToTokenId[productId] = newTokenId;
        tokenIdToProductId[newTokenId] = productId;
        tokenIdToPrice[newTokenId] = price;
        tokenIdToImageUrl[newTokenId] = imageUrl;

        // Acuñando el nuevo NFT al usuario actual (el que llama a la función).
        _mint(msg.sender, newTokenId);

        // Almacenando la información del producto tokenizado en el mapeo.
        tokenizedProducts[newTokenId] = TokenizedProduct(
            newTokenId,
            price,
            imageUrl,
            true // Estableciendo el estado inicial como activo.
        );

        // Emitiendo evento de producto tokenizado.
        emit ProductTokenized(productId, newTokenId, msg.sender, price);

        // Retornando el nuevo tokenId.
        return newTokenId;
    }

    // Función para obtener el total de productos tokenizados (NFTs).
    function getTotalTokenizedProducts() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // Función para permitir al propietario del contrato transferir manualmente un NFT de un usuario a otro.
    // Objetivo: Permite al propietario del contrato transferir manualmente un NFT de un usuario a otro.

    // Parámetros:
    // from: Dirección del actual propietario del NFT.
    // to: Dirección del nuevo propietario del NFT.
    // tokenId: Identificador del NFT a transferir.
    // Notas: Esta función solo puede ser llamada por el propietario del contrato y podría usarse para resolver disputas o corregir errores.
    function transferNFT(
        address from,
        address to,
        uint256 tokenId
    ) external onlyOwner {
        // Transfiriendo el NFT de 'from' a 'to'.
        _transfer(from, to, tokenId);
    }

    // Función para obtener el productId asociado a un tokenId.
    function getProductId(uint256 tokenId) external view returns (uint256) {
        return tokenIdToProductId[tokenId];
    }

    // Función para obtener el tokenId asociado a un productId.
    function getTokenId(uint256 productId) external view returns (uint256) {
        return productIdToTokenId[productId];
    }

    // Función para obtener el precio de un tokenId.
    function getPrice(uint256 tokenId) external view returns (uint256) {
        return tokenIdToPrice[tokenId];
    }

    // Función para comprar un NFT.
    // Objetivo: Permite a un usuario comprar un NFT.

    // Parámetros:
    // tokenId: Identificador del NFT a comprar.

    // Flujo:
    // Verifica que el valor enviado sea suficiente para comprar el NFT.
    // Verifica que el comprador no sea el actual propietario del NFT.
    // Transfiere los ethers al actual propietario del NFT.
    // Transfiere el NFT al comprador.
    // Emite el evento NFTPurchased.
    // Notas: Los compradores llamarán a esta función enviando ethers para comprar un NFT.
    function purchaseNFT(uint256 tokenId) external payable {
        // Obteniendo el precio del NFT.
        uint256 price = tokenIdToPrice[tokenId];
        // Verificando que el valor enviado sea suficiente.
        require(msg.value >= price, "Fondos insuficientes");

        // Obteniendo el propietario actual del NFT.
        address currentOwner = ownerOf(tokenId);
        // Verificando que el comprador no sea el propietario actual.
        require(
            currentOwner != msg.sender,
            "Tu ya eres el propietario de este token."
        );

        // Transfiriendo los ethers al propietario actual.
        payable(currentOwner).transfer(price);
        // Devolviendo el exceso de ethers al comprador.
        uint256 excess = msg.value - price;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
        // Transfiriendo el NFT al comprador.
        _transfer(currentOwner, msg.sender, tokenId);

        // Emitiendo evento de compra de NFT.
        emit NFTPurchased(tokenId, msg.sender, price);

        // Después de transferir el NFT al comprador, marca el token como inactivo.
        tokenizedProducts[tokenId].isActive = false;
    }

    // Función para cambiar el precio de un NFT.
    // Objetivo: Permite al propietario de un NFT cambiar su precio.

    // Parámetros:
    // tokenId: Identificador del NFT.
    // newPrice: Nuevo precio del NFT en wei.

    // Flujo:
    // Verifica que el llamante sea el propietario del NFT.
    // Actualiza el precio del NFT.
    // Emite el evento PriceChanged.
    // Notas: Los propietarios de NFTs usarán esta función para modificar el precio de sus NFTs.
    function changePrice(uint256 tokenId, uint256 newPrice) external {
        // Verficiar que solo el dueño del token pueda modificarle el precio.
        require(
            ownerOf(tokenId) == msg.sender,
            "Solo el propietario del token puede modificar su precio."
        );
        // Actualizando el precio en el mapeo.
        tokenIdToPrice[tokenId] = newPrice;

        // Actualizando el precio en la estructura TokenizedProduct dentro del mapeo tokenizedProducts.
        tokenizedProducts[tokenId].price = newPrice;

        // Emitiendo evento de cambio de precio.
        emit PriceChanged(tokenId, newPrice);
    }

    //---------------------------

    function toggleTokenStatus(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "Solo el propietario puede cambiar el estado del token"
        );
        tokenizedProducts[tokenId].isActive = !tokenizedProducts[tokenId]
            .isActive;
    }

    function getActiveTokensOfUser()
        external
        view
        returns (TokenizedProduct[] memory)
    {
        address user = msg.sender;
        uint256[] memory userTokens = tokensOfOwner(user); // Obtener tokens fuera del bucle
        uint256 tokenCount = userTokens.length;
        TokenizedProduct[] memory activeTokens = new TokenizedProduct[](
            tokenCount
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = userTokens[i];
            if (tokenizedProducts[tokenId].isActive) {
                activeTokens[counter] = tokenizedProducts[tokenId];
                counter++;
            }
        }
        return activeTokens;
    }

    function getInactiveTokensOfUser()
        external
        view
        returns (TokenizedProduct[] memory)
    {
        address user = msg.sender;
        uint256[] memory userTokens = tokensOfOwner(user); // Obtener tokens fuera del bucle
        uint256 tokenCount = userTokens.length;
        TokenizedProduct[] memory inactiveTokens = new TokenizedProduct[](
            tokenCount
        );
        uint256 counter = 0;
        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = userTokens[i];
            if (!tokenizedProducts[tokenId].isActive) {
                inactiveTokens[counter] = tokenizedProducts[tokenId];
                counter++;
            }
        }
        return inactiveTokens;
    }

    //---------------------------

    // Función para retirar los ethers del contrato.
    // Objetivo: Permite al propietario del contrato retirar los ethers acumulados.

    // Flujo:
    // Transfiere todos los ethers del contrato al propietario del contrato.
    // Notas:
    // Esta función solo puede ser llamada por el propietario del contrato.
    // Aunque en la implementación actual del contrato los ethers no se acumulan (ya que se transfieren directamente al vendedor),
    // esta función puede ser útil en futuras implementaciones donde:
    // - Se cobre una comisión por cada venta de NFT, que se acumule en el contrato.
    // - El contrato acepte donaciones o pagos por otros servicios.
    // - Se necesite manejar ethers enviados por error al contrato.
    // En tales casos, esta función permitirá al propietario del contrato retirar los ethers acumulados.

    function withdraw() external onlyOwner {
        // Transfiriendo todos los ethers al propietario del contrato.
        payable(owner()).transfer(address(this).balance);
    }
}
