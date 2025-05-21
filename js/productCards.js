const renderproductCard =  ({id,photo,price,name}) =>{
    const li = document.createElement ('li');
    li.classList.add('product','item','column','js-product');
    li.innerHTML = `
    <div class = 'product-card'> 
            <img src= '${photo}' alt = "coffe image " class = " product-image" >
            <div class = "product-info">
                <h2> ${name}</h2>
                <p>${price} грн</p>
                <button class="add-to-cart-btn js-add-to-cart" data-product-id= ${id }>Додати в кошик</button>
            </div>
    </div>        
    `;
    return li;
};
const appendproductCard = (product, container) =>{
    container.append(product);
}
const renderProductCards = (products, container)=>{
    // console.log(products);

    products.forEach((product) => {
        const card = renderproductCard (product);
        console.log('card', card);
        appendproductCard(card, container)
        
    });

};

export default renderProductCards;