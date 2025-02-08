import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';

const mockPrismaService = {
  item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ItemsServiceTest', () => {
  let itemsService: ItemsService;
  let prismaService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      prismaService.item.findMany.mockResolvedValue([]);
      const expected = [];
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const item: Item = {
        id: 'test-id1',
        name: 'test-item1',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'test-user1',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      prismaService.item.findUnique.mockResolvedValue(item);

      const result = await itemsService.findById('test-id1');
      expect(result).toEqual(item);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(prismaService.item.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-id1' },
      });
    });

    it('異常系: 商品が存在しない', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      prismaService.item.findUnique.mockResolvedValue(null);
      await expect(itemsService.findById('test-id1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('正常系', async () => {
      const item: Item = {
        id: 'test-id1',
        name: 'test-item1',
        price: 100,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'test-user1',
      };
      const createItemDto: CreateItemDto = {
        name: 'test-item1',
        price: 100,
        description: '',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      prismaService.item.create.mockResolvedValue(item);

      const result = await itemsService.create(createItemDto, 'test-user1');

      expect(result).toEqual(item);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(prismaService.item.create).toHaveBeenCalledWith({
        data: {
          name: 'test-item1',
          price: 100,
          description: '',
          status: ItemStatus.ON_SALE,
          userId: 'test-user1',
        },
      });
    });
  });

  describe('updateStatus', () => {
    it('正常系', async () => {
      const item: Item = {
        id: 'test-id1',
        name: 'test-item1',
        price: 100,
        description: '',
        status: ItemStatus.SOLD_OUT,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        userId: 'test-user1',
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      prismaService.item.update.mockResolvedValue(item);

      const result = await itemsService.updateStatus('test-id1');

      expect(result).toEqual(item);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(prismaService.item.update).toHaveBeenCalledWith({
        data: {
          status: 'SOLD_OUT',
        },
        where: { id: 'test-id1' },
      });
    });
  });

  describe('delete', () => {
    it('正常系', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      prismaService.item.delete.mockResolvedValue(null);

      await itemsService.delete('test-id1', 'test-user1');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(prismaService.item.delete).toHaveBeenCalledWith({
        where: { id: 'test-id1', userId: 'test-user1' },
      });
    });
  });
});
