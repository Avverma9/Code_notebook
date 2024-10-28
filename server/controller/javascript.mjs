import Javascript from '../model/javascript.mjs';

const create = async (req, res) => {
    try {
        const data = req.body;
        const created = await Javascript.create(data);
        return res.status(201).json(created);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const get = async (_, res) => {
    try {
        const findData = await Javascript.find();
        return res.status(200).json(findData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getByTitle = async (req, res) => {
    try {
        const { title } = req.query;
        const findData = await Javascript.findOne({ title: title });

        if (!findData) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return res.status(200).json(findData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const findData = await Javascript.findById(id);

        if (!findData) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return res.status(200).json(findData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updateData = await Javascript.findByIdAndUpdate(id, data, { new: true });

        if (!updateData) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return res.status(200).json(updateData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteData = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await Javascript.findByIdAndDelete(id);

        if (!deletedData) {
            return res.status(404).json({ message: 'Document not found' });
        }

        return res.status(200).json({ message: `Successfully deleted document with ID: ${id}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Export all functions
export default { create, get, update, deleteData, getById, getByTitle };
