import httpStatus from "http-status";

/**
 * Classe que representa um erro personalizado
 * @extends Error
 */
class ExtendableError extends Error {
  constructor(message, status, isPublic) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic; // Indica se a mensagem de erro deve ser exibida ao usuário
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * Classe que representa um erro específico de API.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Cria uma nova instância de API error.
   * @param {string} message - Mensagem do erro.
   * @param {number} status - [status=httpStatus.INTERNAL_SERVER_ERROR] - Código de status HTTP do erro, padrão é 500 (Internal Server Error).
   * @param {boolean} isPublic - [isPublic=false] - Indica se a mensagem deve ser visível ao usuário, padrão é false.
   */
  constructor(message, status = httpStatus.INTERNAL_SERVER_ERROR, isPublic = false) {
    super(message, status, isPublic); // Chama o construtor da classe ExtendableError
  }
}

export default APIError;