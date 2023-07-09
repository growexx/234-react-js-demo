import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:3500/auth/signin', (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === 'demo@test.com' && password === 'Demo@test123.com') {
      return res(
        ctx.json({
          token: '12345678221',
          data: {
            _id: '123',
            firstName: 'Test',
            lastName: 'Demo',
            email,
            token: '12345678201'
          },
          status: 1,
          message: 'Success'
        })
      );
    } else if (
      (email !== 'demo@test.com' && password === 'Demo@test123.com') ||
      (email === 'demo@test.com' && password !== 'Demo@test123.com')
    ) {
      return res(
        ctx.status(401),
        ctx.json({
          status: 0,
          message: 'Unauthorized'
        })
      );
    } else {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Missing Username or Password'
        })
      );
    }
  }),
  rest.post('http://localhost:3500/blog', (req, res, ctx) => {
    const { title, description, content } = req.body;
    if (!title || !description || !content) {
      return res(ctx.status(400), ctx.json({ status: 0, message: 'Bad Request' }));
    } else {
      return res(
        ctx.json({
          data: {
            _id: '123',
            title,
            description,
            content
          },
          status: 1,
          message: 'Success'
        })
      );
    }
  }),
  rest.get('http://localhost:3500/blog/:id', (req, res, ctx) => {
    const { id } = req.params;
    console.log('inside get blog.....', req.params);
    return res(
      ctx.json({
        data: {
          _id: '123',
          title: 'Test Blog',
          description: 'Test Description',
          content: 'Test Content'
        },
        status: 1,
        message: 'Success'
      })
    );
  }),
  rest.put('http://localhost:3500/blog/:id', (req, res, ctx) => {
    const { id } = req.params;
    console.log('inside get blog.....', req.params);
    return res(
      ctx.json({
        data: {
          _id: '123',
          title: 'Test Blog',
          description: 'Test Description',
          content: 'Test Content'
        },
        status: 1,
        message: 'Success'
      })
    );
  })
];
