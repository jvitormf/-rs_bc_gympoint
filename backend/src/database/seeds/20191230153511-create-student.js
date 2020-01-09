module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'students',
      [
        {
          name: 'João',
          email: 'joao@gympoint.com',
          age: 25,
          weight: 85,
          height: 180,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Teo',
          email: 'teo@gympoint.com',
          age: 25,
          weight: 85,
          height: 180,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Pedro',
          email: 'pedro@gympoint.com',
          age: 25,
          weight: 85,
          height: 180,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
