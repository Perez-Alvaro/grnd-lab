const fs = require('fs');
const file = 'src/lib/transformers/routineTransformer.js';
let content = fs.readFileSync(file, 'utf8');

// The current broken closing (lines 152-155):
//                 }))
//           }))
//       }))
//   };
//
// What it should be (explicit return in map needs different closing):
//                 }))
//           };
//         })
//       }))
//   };

// Find and replace using the actual chars in file
const broken = '                }))\r\n          }))\r\n      }))\r\n  };';
const fixed = '                }))\r\n          };\r\n        })\r\n      }))\r\n  };';

if (content.includes(broken)) {
    content = content.replace(broken, fixed);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed successfully!');
} else {
    // Try without \r
    const broken2 = '                }))\n          }))\n      }))\n  };';
    const fixed2 = '                }))\n          };\n        })\n      }))\n  };';
    if (content.includes(broken2)) {
        content = content.replace(broken2, fixed2);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed successfully (LF variant)!');
    } else {
        console.error('Pattern not found. Current content around line 152:');
        const lines = content.split('\n');
        for (let i = 148; i < 160; i++) {
            console.log(`${i + 1}: ${JSON.stringify(lines[i])}`);
        }
    }
}
