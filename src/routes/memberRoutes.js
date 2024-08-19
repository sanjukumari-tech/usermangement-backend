const express = require('express');
const fs = require('fs');
const path = require('path');

const members = [];

module.exports = (upload) => {
  const router = express.Router();

  // Get all members
  router.get('/', (req, res) => {
    res.render('members', { members });
  });

  // Add a new member
  router.post('/add', upload.single('profilePic'), (req, res) => {
    const { name, email } = req.body;
    const profilePic = req.file ? `/uploads/profile-pics/${req.file.filename}` : '';

    const newMember = { id: Date.now(), name, email, profilePic };
    members.push(newMember);

    console.log(`New member added: ${JSON.stringify(newMember)}`);
    res.redirect('/members');
  });

  // Update member info
  router.post('/update/:id', upload.single('profilePic'), (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const profilePic = req.file ? `/uploads/profile-pics/${req.file.filename}` : null;

    const memberIndex = members.findIndex(member => member.id == id);

    if (memberIndex !== -1) {
      if (profilePic) {
        // Remove old profile pic if exists
        if (members[memberIndex].profilePic) {
          fs.unlinkSync(path.join(__dirname, '..', members[memberIndex].profilePic));
        }
        members[memberIndex].profilePic = profilePic;
      }
      members[memberIndex].name = name;
      members[memberIndex].email = email;

      console.log(`Member updated: ${JSON.stringify(members[memberIndex])}`);
      res.redirect('/members');
    } else {
      res.status(404).send('Member not found');
    }
  });

  // Delete member
  router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const memberIndex = members.findIndex(member => member.id == id);

    if (memberIndex !== -1) {
      if (members[memberIndex].profilePic) {
        fs.unlinkSync(path.join(__dirname, '..', members[memberIndex].profilePic));
      }
      members.splice(memberIndex, 1);

      console.log(`Member deleted: ${id}`);
      res.redirect('/members');
    } else {
      res.status(404).send('Member not found');
    }
  });

  return router;
};
