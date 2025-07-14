# Contributing to Node.js Backend Template

Thank you for your interest in contributing to this open source project! We welcome contributions from the community while maintaining high code quality standards.

## 🤝 How to Contribute

### Types of Contributions We Welcome:

- 🐛 **Bug fixes** - Help us identify and fix issues
- ✨ **New features** - Enhance the template's functionality
- 📚 **Documentation** - Improve guides and references
- 🧪 **Tests** - Add or improve test coverage
- 🎨 **Code quality** - Refactor and optimize existing code
- 💡 **Ideas** - Share suggestions via issues

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/nodejs-backend-template.git
cd nodejs-backend-template
npm install
```

### 2. Set Up Development Environment

```bash
# Generate configuration
npm run setup:config

# Set up database (adjust for your system)
mysql -u root -p -e "CREATE DATABASE backend_template_dev;"
npm run db:migrate

# Start development server
npm run dev
```

### 3. Create Feature Branch

```bash
# Always branch from develop
git checkout develop
git pull origin develop
npm run branch:feature feature/your-feature-name
```

## 📋 Development Guidelines

### Code Standards

- **Follow ESLint configuration** - Run `npm run lint` before committing
- **Use Prettier formatting** - Run `npm run format` before committing
- **Write tests** - Add tests for new functionality
- **Update documentation** - Keep docs current with changes
- **Use conventional commits** - Follow commit message format

### Commit Message Format

```
type(scope): short description

Examples:
feat(auth): add password reset functionality
fix(database): resolve connection timeout issue
docs(readme): update installation instructions
test(users): add user creation tests
```

### Code Quality Checklist

```bash
# Before submitting PR:
npm run lint           # Check code style
npm run format         # Format code
npm test              # Run all tests
npm run test:coverage # Check test coverage
```

## 🔄 Pull Request Process

### 1. Prepare Your Changes

- Ensure your code follows project standards
- Add tests for new functionality
- Update documentation if needed
- Test your changes thoroughly

### 2. Submit Pull Request

- **Target branch**: `develop` (not main)
- **Title**: Clear, descriptive title
- **Description**: Explain what changes and why
- **Link issues**: Reference related issues if any

### 3. Review Process

- Maintainer will review within 48 hours
- Address any requested changes
- Once approved, maintainer will merge
- Branch will be automatically deleted

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode during development
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test -- users.test.js
```

### Writing Tests

- Place tests in `tests/` directory
- Use descriptive test names
- Test both success and error cases
- Aim for high test coverage

## 📚 Documentation

### What to Document

- New features and APIs
- Configuration changes
- Setup instructions
- Breaking changes

### Documentation Files

- `README.md` - Main project documentation
- `docs/guides/` - Step-by-step guides
- `docs/reference/` - API and reference docs
- Code comments for complex logic

## 🐛 Bug Reports

### Before Reporting

- Check existing issues
- Search documentation
- Try latest version

### Good Bug Report Includes

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Error messages and logs

## 💡 Feature Requests

### Before Requesting

- Check if feature already exists
- Search existing issues
- Consider if it fits project scope

### Good Feature Request Includes

- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Willingness to contribute

## 🎯 Project Scope

### What We Accept

- Features that benefit most users
- Security improvements
- Performance optimizations
- Better developer experience
- Documentation improvements

### What We Don't Accept

- Breaking changes without strong justification
- Features for very specific use cases
- Changes that complicate the template
- Code that doesn't follow project standards

## 🛡️ Code of Conduct

### Our Standards

- **Be respectful** - Treat everyone with respect
- **Be constructive** - Provide helpful feedback
- **Be patient** - Reviews take time
- **Be collaborative** - Work together towards solutions

### Unacceptable Behavior

- Harassment or discrimination
- Insulting or derogatory comments
- Spam or off-topic content
- Sharing private information

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Request Reviews** - Code-specific discussions

### Response Times

- **Issues**: Response within 24-48 hours
- **Pull Requests**: Review within 48 hours
- **Security Reports**: Response within 24 hours

## 🎉 Recognition

### Contributors

- Contributors are recognized in release notes
- Significant contributors may be invited as collaborators
- All contributions are appreciated regardless of size

### Attribution

- Your GitHub profile will be linked in contributions
- Commit history preserves your attribution
- Major contributions may be highlighted in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

**Thank you for making this project better!** 🚀

Every contribution, no matter how small, helps improve this template for the entire community.
