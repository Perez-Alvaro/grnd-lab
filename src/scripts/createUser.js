#!/usr/bin/env node
/**
 * src/scripts/createUser.js
 * CLI utility to add a new user to users.db.json
 *
 * Usage:
 *   node src/scripts/createUser.js
 *
 * Prompts for: name, email, password, role
 * Outputs the JSON object to paste into src/data/users.db.json
 * Passwords are bcrypt-hashed — never stored in plain text.
 */

import bcrypt from 'bcryptjs';
import readline from 'readline';

const SALT_ROUNDS = 10;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt) {
  return new Promise((resolve) => rl.question(prompt, (answer) => resolve(answer.trim())));
}

async function askHidden(query) {
  return new Promise((resolve) => {
    const wasMuted = rl.outputMuted;
    rl.outputMuted = true;
    process.stdout.write(query);

    // Override the internal _writeToOutput to hide characters
    const oldWrite = rl._writeToOutput;
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.outputMuted) {
        // Only allow newlines to be printed
        if (["\n", "\r", "\r\n"].includes(stringToWrite)) {
          oldWrite.call(rl, stringToWrite);
        } else {
          // Optional: print a dot for each character
          oldWrite.call(rl, "•");
        }
      } else {
        oldWrite.call(rl, stringToWrite);
      }
    };

    rl.question("", (answer) => {
      rl.outputMuted = wasMuted;
      rl._writeToOutput = oldWrite;
      resolve(answer);
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function main() {
  console.log('\n🔐  GRIND LAB — Crear nuevo usuario\n');
  console.log('El hash bcrypt se genera localmente. La contraseña en texto plano');
  console.log('nunca se almacena ni se transmite.\n');

  // Name
  let name = '';
  while (!name) {
    name = await ask('Nombre completo: ');
    if (!name) console.log('  ⚠  El nombre es requerido.');
  }

  // Email
  let email = '';
  while (!email || !validateEmail(email)) {
    email = await ask('Email: ');
    if (!validateEmail(email)) {
      console.log('  ⚠  Email inválido. Intentá de nuevo.');
      email = '';
    }
  }

  // Password (with confirmation)
  let password = '';
  while (!password) {
    const p1 = await askHidden('Contraseña (mín. 8 caracteres): ');
    if (p1.length < 8) {
      console.log('  ⚠  La contraseña debe tener al menos 8 caracteres.');
      continue;
    }
    const p2 = await askHidden('Confirmar contraseña: ');
    if (p1 !== p2) {
      console.log('  ⚠  Las contraseñas no coinciden. Intentá de nuevo.\n');
      continue;
    }
    password = p1;
  }

  // Role
  const roleInput = await ask('Rol [admin / coach / viewer] (Enter = coach): ');
  const validRoles = ['admin', 'coach', 'viewer'];
  const role = validRoles.includes(roleInput.toLowerCase())
    ? roleInput.toLowerCase()
    : 'coach';

  console.log('\n⏳  Generando hash bcrypt (salt rounds = 10)...');
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const id = `usr_${Date.now()}`;

  const user = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    active: true,
    createdAt: new Date().toISOString(),
  };

  console.log('\n✅  Usuario generado correctamente.');
  console.log('─'.repeat(60));
  console.log('Copiá este objeto y pegalo dentro del array "users" en:');
  console.log('  src/data/users.db.json\n');
  console.log(JSON.stringify(user, null, 2));
  console.log('\n⚠   No incluyas el campo __devPassword en producción.');
  console.log('─'.repeat(60) + '\n');

  rl.close();
}

main().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
