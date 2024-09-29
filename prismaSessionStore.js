const session = require("express-session");

class PrismaStore extends session.Store {
  constructor(prismaClient) {
    super();
    this.prisma = prismaClient;
  }

  async get(sid, callback) {
    try {
      const session = await this.prisma.session.findUnique({
        where: { sid },
      });
      if (session) {
        callback(null, JSON.parse(session.sess));
      } else {
        callback(null, null);
      }
    } catch (error) {
      callback(error);
    }
  }

  async set(sid, sessionData, callback) {
    try {
      const expireDate = new Date(Date.now() + sessionData.cookie.maxAge);
      await this.prisma.session.upsert({
        where: { sid },
        create: {
          sid,
          sess: sessionData,
          expire: expireDate,
        },
        update: {
          sess: sessionData,
          expire: expireDate,
        },
      });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  async destroy(sid, callback) {
    try {
      await this.prisma.session.delete({
        where: { sid },
      });
      callback(null);
    } catch (error) {
      callback(error);
    }
  }
}

module.exports = PrismaStore;
