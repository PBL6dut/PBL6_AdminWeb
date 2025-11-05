const onViewConfigs = (openModal) => {
    const products = ({ object }) => {
      openModal(
        "detail",
        {
          data: object,
        },
        "product"
      );
    }

    const orders = ({ object }) => {
      openModal(
        "detail",
        {
          data: object,
        },
        "order"
      );
    }

    const customers = ({ object }) => {
      openModal(
        "detail",
        {
          data: object,
        },
        "customer"
      );
    }
    return { products, orders, customers }
}

export default onViewConfigs;